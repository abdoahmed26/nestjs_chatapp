/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
  Req,
} from "@nestjs/common";
import { CallsService } from "./calls.service";
import { UpdateCallDto } from "./dto/update-call.dto";
import type { Request } from "express";
import { AuthGuard } from "src/common/guards/auth.guard";

@Controller(`${process.env.API_VERSION}/calls`)
@UseGuards(AuthGuard)
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Get()
  async findAll(@Req() req: Request) {
    const userId = (req as any).user.id;
    const calls = await this.callsService.findAllForUser(userId);
    return { status: "success", data: calls };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const call = await this.callsService.findOne(id);
    return { status: "success", data: call };
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateCallDto) {
    const call = await this.callsService.update(id, dto);
    return { status: "success", data: call };
  }
}
