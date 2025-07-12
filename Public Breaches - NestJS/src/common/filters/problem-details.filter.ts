import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let title = 'Internal Server Error';
    let detail = 'Unexpected error occurred.';
    let type = `https://httpstatuses.com/500`;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'string') {
        detail = response;
      } else if (typeof response === 'object' && response !== null) {
        const resObj = response as any;
        detail = Array.isArray(resObj.message) ? resObj.message.join(', ') : resObj.message;
        title = resObj.error || HttpStatus[status];
      }

      type = `https://httpstatuses.com/${status}`;
    }

    res.status(status).json({ type, title, status, detail, instance: req.originalUrl });
  }
}
