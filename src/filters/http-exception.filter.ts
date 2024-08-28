import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;
    console.log(exception)
    response.status(status).json({
      statusCode: status,
      error_details: exception.getResponse()["message"] || null,
      message: message,
      timestamp: new Date().toISOString(),
    });
  }
}
