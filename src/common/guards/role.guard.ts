/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Request } from "express";


@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private readonly roles: string[]
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const user = (request as any).user;
        if(!this.roles.includes(user.role)){
            throw new ForbiddenException({status:"forbidden",message:"you don't have permission to access this route"});
        }
        return true;
    }
}