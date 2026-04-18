import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Call, CallStatus } from "./entities/call.entity";
import { CreateCallDto } from "./dto/create-call.dto";
import { UpdateCallDto } from "./dto/update-call.dto";

@Injectable()
export class CallsService {
  constructor(
    @InjectRepository(Call)
    private readonly callRepository: Repository<Call>,
  ) {}

  async create(callerId: string, dto: CreateCallDto): Promise<Call> {
    const call = this.callRepository.create({
      caller: { id: callerId },
      callee: { id: dto.calleeId },
      type: dto.type,
      status: CallStatus.RINGING,
      conversation: dto.conversationId ? { id: dto.conversationId } : undefined,
    });

    return this.callRepository.save(call);
  }

  async findAllForUser(userId: string): Promise<Call[]> {
    return this.callRepository.find({
      where: [
        { caller: { id: userId } },
        { callee: { id: userId } },
      ],
      relations: ["caller", "callee", "conversation"],
      order: { createdAt: "DESC" },
      take: 50,
    });
  }

  async findOne(id: string): Promise<Call> {
    const call = await this.callRepository.findOne({
      where: { id },
      relations: ["caller", "callee", "conversation"],
    });

    if (!call) {
      throw new NotFoundException({ status: "not found", message: "Call not found" });
    }

    return call;
  }

  async update(id: string, dto: UpdateCallDto): Promise<Call> {
    const call = await this.findOne(id);

    if (dto.status) {
      call.status = dto.status;
    }
    if (dto.duration !== undefined) {
      call.duration = dto.duration;
    }

    return this.callRepository.save(call);
  }

  async acceptCall(id: string): Promise<Call> {
    const call = await this.findOne(id);
    call.status = CallStatus.ONGOING;
    call.startedAt = new Date();

    return this.callRepository.save(call);
  }

  async rejectCall(id: string): Promise<Call> {
    const call = await this.findOne(id);
    call.status = CallStatus.REJECTED;
    call.endedAt = new Date();

    return this.callRepository.save(call);
  }

  async endCall(id: string): Promise<Call> {
    const call = await this.findOne(id);
    call.status = CallStatus.ENDED;
    call.endedAt = new Date();

    if (call.startedAt) {
      call.duration = Math.round(
        (call.endedAt.getTime() - call.startedAt.getTime()) / 1000,
      );
    }

    return this.callRepository.save(call);
  }

  async missCall(id: string): Promise<Call> {
    const call = await this.findOne(id);
    call.status = CallStatus.MISSED;
    call.endedAt = new Date();

    return this.callRepository.save(call);
  }

  /**
   * Check whether a user is currently in an ongoing call.
   */
  async isUserInCall(userId: string): Promise<boolean> {
    const count = await this.callRepository.count({
      where: [
        { caller: { id: userId }, status: CallStatus.ONGOING },
        { callee: { id: userId }, status: CallStatus.ONGOING },
        { caller: { id: userId }, status: CallStatus.RINGING },
        { callee: { id: userId }, status: CallStatus.RINGING },
      ],
    });

    return count > 0;
  }
}
