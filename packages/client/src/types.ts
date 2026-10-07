/** Opsi per-request yang didukung base client. */
export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  /** Body JSON — otomatis di-`JSON.stringify` + header `Content-Type`. */
  body?: unknown
  /** Query string — nilai `undefined`/`null` dilewati. */
  query?: Record<string, string | number | boolean | undefined | null>
  headers?: Record<string, string>
  signal?: AbortSignal
}

export interface ApiClientOptions {
  /** Override base URL. Default: env → `http://localhost:4000`. */
  baseUrl?: string
  /** Token awal (opsional). */
  token?: string
}

/** Bentuk body error non-2xx (kontrak server: `message` string atau array). */
export interface ApiErrorBody {
  statusCode?: number
  message?: string | string[]
  code?: string
}

/**
 * Kontrak minimal yang dibutuhkan dari base client — dipenuhi oleh
 * `createApiClient` sehingga API per-domain bisa diuji secara terpisah.
 */
export interface Requester {
  request<T>(path: string, options?: ApiRequestOptions): Promise<T>
  setToken(token: string): void
  getToken(): string | null
  clearToken(): void
}
