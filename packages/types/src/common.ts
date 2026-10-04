/** Bentuk umum response API. */
export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
}

/** Response berisi daftar data + metadata pagination. */
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
