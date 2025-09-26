import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class JSendExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // NestJS HttpExceptions (e.g. from ValidationPipe)
    if (exception instanceof BadRequestException) {
      const res = exception.getResponse() as any;
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: 'fail',
        data: res.message,
      });
    }

    // Prisma unique constraint violation
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        return response.status(HttpStatus.BAD_REQUEST).json({
          status: 'fail',
          data: {
            field: exception.meta?.target,
            message: 'This value must be unique',
          },
        });
      }
    }

    // Any other HttpException (like ForbiddenException, UnauthorizedException)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      return response.status(status).json({
        status: status < 500 ? 'fail' : 'error',
        data: res,
      });
    }

    // Unexpected errors
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: (exception as any).message || 'Internal server error',
    });
  }
}
