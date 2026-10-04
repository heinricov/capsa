import { pino, type Logger as PinoLogger } from "pino"
import type { LogContext, Logger, LoggerOptions, LogLevel } from "./types.ts"

const LOG_LEVELS: readonly LogLevel[] = ["debug", "info", "warn", "error"]

/** Dipakai di client bundle: tanpa output, tanpa pernah menyentuh pino. */
const NOOP_LOGGER: Logger = {
  debug: () => undefined,
  info: () => undefined,
  warn: () => undefined,
  error: () => undefined,
  child: () => NOOP_LOGGER,
}

function readDefaultLevel(): LogLevel {
  if (typeof process === "undefined") return "info"
  const value = process.env.LOG_LEVEL
  return LOG_LEVELS.includes(value as LogLevel) ? (value as LogLevel) : "info"
}

/**
 * `JSON.stringify(new Error())` = `{}` — nilai Error di context dinormalisasi
 * dengan serializer resmi pino agar `message`/`stack` ikut tercatat.
 */
function serializeContext(context: LogContext): LogContext {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(context)) {
    result[key] =
      value instanceof Error ? pino.stdSerializers.err(value) : value
  }
  return result
}

/** Balik signature public (message, context?) ke signature pino (context?, message). */
function wrap(instance: PinoLogger): Logger {
  return {
    debug: (message, context) =>
      context
        ? instance.debug(serializeContext(context), message)
        : instance.debug(message),
    info: (message, context) =>
      context
        ? instance.info(serializeContext(context), message)
        : instance.info(message),
    warn: (message, context) =>
      context
        ? instance.warn(serializeContext(context), message)
        : instance.warn(message),
    error: (message, context) =>
      context
        ? instance.error(serializeContext(context), message)
        : instance.error(message),
    child: (context) => wrap(instance.child(serializeContext(context))),
  }
}

export function createLogger(options: LoggerOptions = {}): Logger {
  // globalThis-cast agar aman tanpa lib DOM (tsconfig Node) maupun dengan lib DOM.
  if (typeof (globalThis as { window?: unknown }).window !== "undefined") {
    return NOOP_LOGGER
  }

  const instance = pino(
    {
      level: options.level ?? readDefaultLevel(),
      timestamp: pino.stdTimeFunctions.isoTime,
    },
    options.destination
  )
  return wrap(instance)
}

/** Instance siap pakai — di server: pino; di browser: no-op. */
export const logger = createLogger()
