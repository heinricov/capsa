import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { AppError, ErrorCode } from '@workspace/errors';
import { ZodError } from 'zod';

function statusToCode(status: number): ErrorCode {
  if (status === 400) return ErrorCode.BAD_REQUEST;
  if (status === 401) return ErrorCode.UNAUTHORIZED;
  if (status === 403) return ErrorCode.FORBIDDEN;
  if (status === 404) return ErrorCode.NOT_FOUND;
  if (status === 409) return ErrorCode.CONFLICT;
  if (status === 422) return ErrorCode.VALIDATION_ERROR;
  return ErrorCode.INTERNAL_SERVER_ERROR;
}

/**
 * Exception filter global: semua error → envelope
 * `{ success:false, statusCode, message, code }` (kontrak api-client).
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    let statusCode = 500;
    let message = 'Internal Server Error';
    let code: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR;

    if (exception instanceof AppError) {
      statusCode = exception.statusCode;
      message = exception.message;
      code = exception.code;
    } else if (exception instanceof ZodError) {
      statusCode = 400;
      code = ErrorCode.BAD_REQUEST;
      const issue = exception.issues[0];
      message = issue
        ? `${issue.path.join('.') || 'value'}: ${issue.message}`
        : 'Validation failed';
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      code = statusToCode(statusCode);
      const body: unknown = exception.getResponse();
      if (typeof body === 'string') {
        message = body;
      } else if (body && typeof body === 'object' && 'message' in body) {
        const raw = (body as { message?: unknown }).message;
        if (typeof raw === 'string') {
          message = raw;
        } else if (Array.isArray(raw)) {
          const parts = raw.filter(
            (item): item is string => typeof item === 'string',
          );
          if (parts.length > 0) message = parts.join(', ');
        }
      }
    } else if (
      exception &&
      typeof exception === 'object' &&
      (exception as { code?: unknown }).code === 'P2025'
    ) {
      statusCode = 404;
      message = 'Resource not found';
      code = ErrorCode.NOT_FOUND;
    }

    if (statusCode >= 500) {
      this.logger.error(
        `Unhandled error: ${message}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response
      .status(statusCode)
      .json({ success: false, statusCode, message, code });
  }
}
