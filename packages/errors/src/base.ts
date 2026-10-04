import type { ErrorCode } from "./codes.ts"

/**
 * Base error untuk seluruh monorepo Capsa.
 *
 * - `statusCode`  : kode HTTP untuk response.
 * - `code`        : kode stabil (bagian dari kontrak API, lihat codes.ts).
 * - `isOperational`: true = error operasional yang aman ditampilkan ke
 *   pengguna; false = kemungkinan bug — jangan dibocorkan detailnya.
 */
export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: ErrorCode
  public readonly isOperational: boolean

  constructor(
    message: string,
    statusCode: number,
    code: ErrorCode,
    isOperational = true
  ) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.isOperational = isOperational
    this.name = new.target.name
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
