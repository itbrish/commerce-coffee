import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorMessage = typeof message === 'object' && message !== null && 'message' in message
      ? (message as any).message
      : typeof message === 'string'
      ? message
      : 'Unexpected error occurred';

    response.status(status).json({
      success: false,
      error: {
        code: status === 404 ? 'NOT_FOUND' : status === 401 ? 'UNAUTHORIZED' : 'ERROR',
        message: Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage,
        statusCode: status,
      },
    });
  }
}
