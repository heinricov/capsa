import type { DestinationStream } from "pino"

/** Level log — semakin rendah, semakin detail. */
export type LogLevel = "debug" | "info" | "warn" | "error"

/** Metadata tambahan yang menyertai sebuah log. */
export type LogContext = Record<string, unknown>

/**
 * Kontrak logger monorepo Capsa. Di server berjalan di atas pino; di browser
 * (client bundle) instance-nya no-op.
 */
export interface Logger {
  debug(message: string, context?: LogContext): void
  info(message: string, context?: LogContext): void
  warn(message: string, context?: LogContext): void
  error(message: string, context?: LogContext): void
  /** Logger turunan dengan context yang selalu ikut (mis. `requestId`). */
  child(context: LogContext): Logger
}

export interface LoggerOptions {
  /** Default: env `LOG_LEVEL` (bila valid) atau `"info"`. */
  level?: LogLevel
  /** Tujuan output — ganti dengan transport khusus (file, service, …). */
  destination?: DestinationStream
}
