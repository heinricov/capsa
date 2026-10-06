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

/**
 * Pilih mode output:
 * - `LOG_FORMAT=pretty` → pino-pretty (dev-facing, warna + jam ringkas)
 * - `LOG_FORMAT=json`   → JSON selalu (override manual)
 * - default: pretty kecuali production (`NODE_ENV=production`) atau test
 *   (`JEST_WORKER_ID` — hindari spawn worker thread di jest).
 *
 * Heuristic NODE_ENV, bukan `isTTY`: `turbo dev` men-pipe stdout sehingga
 * isTTY=false walau terminal — pretty tetap aktif di development.
 */
function prettyTransport():
  { target: string; options: Record<string, unknown> } | undefined {
  const format = process.env.LOG_FORMAT
  const enabled =
    format === "pretty" ||
    (format !== "json" &&
      process.env.NODE_ENV !== "production" &&
      !process.env.JEST_WORKER_ID)
  if (!enabled) return undefined
  return {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:HH:MM:ss.l",
      ignore: "pid,hostname",
    },
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
      transport: options.destination ? undefined : prettyTransport(),
    },
    options.destination
  )
  return wrap(instance)
}

/** Instance siap pakai — di server: pino; di browser: no-op. */
export const logger = createLogger()
