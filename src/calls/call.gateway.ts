/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { CallsService } from "./calls.service";
import { CallType } from "./entities/call.entity";

/** Timeout for unanswered calls (ms). */
const CALL_TIMEOUT_MS = 30_000;

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class CallGateway {
  @WebSocketServer()
  server: Server;

  /** Maps a userId → active callId so we can detect busy state. */
  private activeCalls = new Map<string, string>();

  /** Pending timeout handles keyed by callId. */
  private timeouts = new Map<string, ReturnType<typeof setTimeout>>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly callsService: CallsService,
  ) {}

  // ─── Auth helpers ────────────────────────────────────────────────

  private authenticate(client: Socket): { id: string; name: string } {
    const auth = client.handshake.headers.authorization;
    if (!auth) {
      throw new UnauthorizedException("No token provided");
    }
    const token = auth.split(" ")[1];
    const payload = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    return payload;
  }

  private getUserId(client: Socket): string {
    return client.data?.user?.id;
  }

  // ─── Lifecycle ───────────────────────────────────────────────────

  handleConnection(client: Socket) {
    try {
      const payload = this.authenticate(client);
      client.data.user = payload;
      // Join the user's personal room for targeted events
      void client.join(payload.id);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.getUserId(client);
    if (userId) {
      const callId = this.activeCalls.get(userId);
      if (callId) {
        // End the call if the user disconnects
        void this.handleEndCall(client, { callId });
      }
    }
  }

  // ─── Utility ─────────────────────────────────────────────────────

  private clearCallTimeout(callId: string) {
    const handle = this.timeouts.get(callId);
    if (handle) {
      clearTimeout(handle);
      this.timeouts.delete(callId);
    }
  }

  // ─── Call Signaling Events ───────────────────────────────────────

  @SubscribeMessage("call:initiate")
  async handleInitiateCall(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { calleeId: string; type: "audio" | "video"; conversationId?: string },
  ) {
    const callerId = this.getUserId(client);

    // Check if callee is busy
    const isBusy = await this.callsService.isUserInCall(data.calleeId);
    if (isBusy) {
      // Still create a record so it shows in history
      const call = await this.callsService.create(callerId, {
        calleeId: data.calleeId,
        type: data.type as CallType,
        conversationId: data.conversationId,
      });
      await this.callsService.missCall(call.id);
      this.server.to(callerId).emit("call:busy", { callId: call.id });
      return;
    }

    // Create the call record
    const call = await this.callsService.create(callerId, {
      calleeId: data.calleeId,
      type: data.type as CallType,
      conversationId: data.conversationId,
    });

    // Track active calls
    this.activeCalls.set(callerId, call.id);
    this.activeCalls.set(data.calleeId, call.id);

    // Notify callee
    const fullCall = await this.callsService.findOne(call.id);
    this.server.to(data.calleeId).emit("call:incoming", {
      callId: call.id,
      caller: {
        id: fullCall.caller.id,
        name: fullCall.caller.name,
        profileImage: fullCall.caller.profileImage || null,
      },
      type: call.type,
    });

    // Start timeout
    const timeout = setTimeout(async () => {
      try {
        await this.callsService.missCall(call.id);
        this.activeCalls.delete(callerId);
        this.activeCalls.delete(data.calleeId);
        this.server.to(callerId).emit("call:timeout", { callId: call.id });
        this.server.to(data.calleeId).emit("call:timeout", { callId: call.id });
      } catch {
        // Call may have already been handled
      }
    }, CALL_TIMEOUT_MS);

    this.timeouts.set(call.id, timeout);
  }

  @SubscribeMessage("call:accept")
  async handleAcceptCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { callId: string },
  ) {
    this.clearCallTimeout(data.callId);

    const call = await this.callsService.acceptCall(data.callId);

    // Notify the caller that the call was accepted
    this.server.to(call.caller.id).emit("call:accepted", {
      callId: data.callId,
    });
  }

  @SubscribeMessage("call:reject")
  async handleRejectCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { callId: string },
  ) {
    this.clearCallTimeout(data.callId);

    const call = await this.callsService.rejectCall(data.callId);

    // Remove active tracking
    this.activeCalls.delete(call.caller.id);
    this.activeCalls.delete(call.callee.id);

    // Notify the caller
    this.server.to(call.caller.id).emit("call:rejected", {
      callId: data.callId,
    });
  }

  @SubscribeMessage("call:end")
  async handleEndCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { callId: string },
  ) {
    this.clearCallTimeout(data.callId);

    try {
      const call = await this.callsService.endCall(data.callId);

      // Remove active tracking
      this.activeCalls.delete(call.caller.id);
      this.activeCalls.delete(call.callee.id);

      // Notify both participants
      const payload = { callId: data.callId, duration: call.duration || 0 };
      this.server.to(call.caller.id).emit("call:ended", payload);
      this.server.to(call.callee.id).emit("call:ended", payload);
    } catch {
      // Call may already be ended
    }
  }

  // ─── WebRTC Signaling ────────────────────────────────────────────

  @SubscribeMessage("signal:offer")
  async handleOffer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { callId: string; sdp: any },
  ) {
    const call = await this.callsService.findOne(data.callId);
    const senderId = this.getUserId(client);
    const peerId =
      call.caller.id === senderId ? call.callee.id : call.caller.id;

    this.server.to(peerId).emit("signal:offer", {
      callId: data.callId,
      sdp: data.sdp,
    });
  }

  @SubscribeMessage("signal:answer")
  async handleAnswer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { callId: string; sdp: any },
  ) {
    const call = await this.callsService.findOne(data.callId);
    const senderId = this.getUserId(client);
    const peerId =
      call.caller.id === senderId ? call.callee.id : call.caller.id;

    this.server.to(peerId).emit("signal:answer", {
      callId: data.callId,
      sdp: data.sdp,
    });
  }

  @SubscribeMessage("signal:ice")
  async handleIce(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { callId: string; candidate: any },
  ) {
    const call = await this.callsService.findOne(data.callId);
    const senderId = this.getUserId(client);
    const peerId =
      call.caller.id === senderId ? call.callee.id : call.caller.id;

    this.server.to(peerId).emit("signal:ice", {
      callId: data.callId,
      candidate: data.candidate,
    });
  }
}
