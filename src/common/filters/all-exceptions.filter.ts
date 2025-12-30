import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = exception.getResponse() as string;
        }
        if(process.env.NODE_ENV === 'development'){
            response.status(status).json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                error: message,
            });
        }else{
            response.status(status).json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                error: message,
            });
        }
    }
}
