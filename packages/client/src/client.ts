import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@workspace/errors"
import type { ApiResponse } from "./common/types.ts"
import { type AccountApi, createAccountApi } from "./account/api/index.ts"
import { type AuthApi, createAuthApi } from "./auth/api/index.ts"
import type {
  ApiClientOptions,
  ApiErrorBody,
  ApiRequestOptions,
} from "./types.ts"

const DEFAULT_BASE_URL = "http://localhost:4000"

/**
 * Static-literal access — bundler (Turbopack/webpack/Metro) meng-inline
 * `process.env.NEXT_PUBLIC_API_URL` di web dan `EXPO_PUBLIC_API_URL` di RN.
 * `typeof process` menjaga package tetap aman di lingkungan tanpa Node globals.
 */
function resolveBaseUrl(): string {
  if (typeof process !== "undefined") {
    const raw =
      process.env.NEXT_PUBLIC_API_URL ?? process.env.EXPO_PUBLIC_API_URL
    if (raw) return raw
  }
  return DEFAULT_BASE_URL
}

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "")
}

function buildUrl(
  baseUrl: string,
  path: string,
  query?: ApiRequestOptions["query"]
): string {
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`
  if (!query) return url
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null) params.append(key, String(value))
  }
  const qs = params.toString()
  return qs ? `${url}?${qs}` : url
}

function extractMessage(body: unknown, fallback: string): string {
  if (body && typeof body === "object") {
    const message = (body as ApiErrorBody).message
    if (typeof message === "string" && message.length > 0) return message
    if (Array.isArray(message) && message.length > 0) return message.join(", ")
  }
  return fallback
}

/** Status di luar mapping `@workspace/errors` — tetap terbawa `statusCode`. */
export class ApiError extends Error {
  public readonly statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.name = "ApiError"
    this.statusCode = statusCode
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/** Fetch gagal total (network/abort/CORS) — request tak terkirim/tak terbaca. */
export class ApiNetworkError extends Error {
  constructor(
    message = "Network request failed",
    options?: { cause?: unknown }
  ) {
    super(message, options)
    this.name = "ApiNetworkError"
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

function toHttpError(status: number, message: string): Error {
  if (status === 400) return new BadRequestError(message)
  if (status === 401) return new UnauthorizedError(message)
  if (status === 403) return new ForbiddenError(message)
  if (status === 404) return new NotFoundError(message)
  if (status === 409) return new ConflictError(message)
  if (status === 422) return new ValidationError(message)
  if (status >= 500) return new InternalServerError(message)
  return new ApiError(message, status)
}

export interface ApiClient {
  readonly baseUrl: string
  /** Kirim request, unwrap `ApiResponse<T>`, lempar error sesuai status. */
  request<T>(path: string, options?: ApiRequestOptions): Promise<T>
  setToken(token: string): void
  clearToken(): void
  getToken(): string | null
  readonly account: AccountApi
  readonly auth: AuthApi
}

export function createApiClient(options: ApiClientOptions = {}): ApiClient {
  const baseUrl = stripTrailingSlash(options.baseUrl ?? resolveBaseUrl())
  let token: string | null = options.token ?? null

  async function request<T>(
    path: string,
    req: ApiRequestOptions = {}
  ): Promise<T> {
    const { method = "GET", body, query, headers = {}, signal } = req
    const requestHeaders: Record<string, string> = {
      Accept: "application/json",
      ...headers,
    }
    if (token) requestHeaders.Authorization = `Bearer ${token}`
    if (body !== undefined) requestHeaders["Content-Type"] = "application/json"

    let response: Response
    try {
      response = await fetch(buildUrl(baseUrl, path, query), {
        method,
        headers: requestHeaders,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal,
      })
    } catch (cause) {
      throw new ApiNetworkError("Network request failed", { cause })
    }

    const payload: unknown = await response.json().catch(() => undefined)

    if (!response.ok) {
      const message = extractMessage(
        payload,
        `Request failed with status ${response.status}`
      )
      throw toHttpError(response.status, message)
    }

    const envelope = payload as ApiResponse<T> | undefined
    if (!envelope || envelope.success !== true) {
      throw new ApiError(
        extractMessage(payload, "Invalid response envelope"),
        response.status
      )
    }
    return envelope.data as T
  }

  const setToken = (value: string): void => {
    token = value
  }

  const requester = {
    request,
    setToken,
    getToken: () => token,
    clearToken: () => {
      token = null
    },
  }

  return {
    baseUrl,
    request,
    account: createAccountApi(requester),
    auth: createAuthApi(requester),
    setToken,
    clearToken: requester.clearToken,
    getToken: () => token,
  }
}

/** Instance siap pakai — base URL dari env. */
export const api = createApiClient()
