import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorBody {
  code: string;
  message: string;
  details: unknown[];
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { status, body } = this.resolve(exception);

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        exception instanceof Error ? exception.stack : exception,
      );
    }

    response.status(status).json({ error: body });
  }

  private resolve(exception: unknown): { status: HttpStatus; body: ErrorBody } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'object' && response !== null) {
        const { message, error } = response as {
          message?: string | string[];
          error?: string;
        };
        const details = Array.isArray(message) ? message : [];
        const singleMessage = Array.isArray(message)
          ? (error ?? exception.message)
          : (message ?? exception.message);

        return {
          status,
          body: {
            code: this.codeFromStatus(status),
            message: singleMessage,
            details,
          },
        };
      }

      return {
        status,
        body: {
          code: this.codeFromStatus(status),
          message: exception.message,
          details: [],
        },
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      body: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
        details: [],
      },
    };
  }

  private codeFromStatus(status: number): string {
    return HttpStatus[status] ?? 'ERROR';
  }
}
