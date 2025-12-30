/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>();
        if(!request.headers.authorization){
            throw new UnauthorizedException("unauthorized");
        }
        const token = request.headers.authorization.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException("unauthorized");
        }
        try {
            const user = await this.jwtService.verify(token);
            (request as any).user = user;
        } catch {
            throw new UnauthorizedException("invalid token");
        }
        return true;
    }
}