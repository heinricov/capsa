import { LoggerService } from '@nestjs/common';
import { logger, type LogContext, type Logger } from '@workspace/logger';

/** String aman untuk message yang bukan string (objek → JSON bila mungkin). */
function text(message: unknown): string {
  if (typeof message === 'string') return message;
  if (message instanceof Error) return message.message;
  try {
    return JSON.stringify(message);
  } catch {
    return String(message);
  }
}

/**
 * Adapter NestJS → `@workspace/logger` (pino, timestamp ISO 8601).
 * Level mengikuti env `LOG_LEVEL` (default `info`; verbose/debug → `debug`).
 */
export class PinoLoggerAdapter implements LoggerService {
  constructor(private readonly pino: Logger = logger) {}

  log(message: unknown, context?: string): void {
    this.pino.info(text(message), context ? { context } : undefined);
  }

  error(
    message: unknown,
    stackOrError?: string | Error,
    context?: string,
  ): void {
    const ctx: LogContext = context ? { context } : {};
    if (stackOrError instanceof Error) ctx.err = stackOrError;
    else if (stackOrError) ctx.stack = stackOrError;
    this.pino.error(text(message), Object.keys(ctx).length ? ctx : undefined);
  }

  warn(message: unknown, context?: string): void {
    this.pino.warn(text(message), context ? { context } : undefined);
  }

  debug(message: unknown, context?: string): void {
    this.pino.debug(text(message), context ? { context } : undefined);
  }

  verbose(message: unknown, context?: string): void {
    this.pino.debug(text(message), context ? { context } : undefined);
  }
}
