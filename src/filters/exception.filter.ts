import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { Response } from 'express';
import { isHttpException } from '../utils/http-exception.util';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: AxiosError | HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (isHttpException(exception)) {
      const status = exception.getStatus();
      return response.status(status).json(exception.getResponse());
    }
    if (axios.isAxiosError(exception)) {
      return response
        .status(exception.response?.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          name: exception.name,
          error: exception.response?.data || exception.message,
        });
    } 
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      name: exception.name,
      error: exception.message,
    });
  }
}
