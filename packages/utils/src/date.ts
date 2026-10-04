/**
 * Format tanggal dengan `Intl.DateTimeFormat` (`dateStyle: "medium"`).
 * `locale` default = locale runtime. Input tidak valid melempar
 * `RangeError` — cek `isValidDate()` dulu bila ragu.
 */
export function formatDate(date: Date | string, locale?: string): string {
  const value = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(value)
}

/** True bila `Date` valid atau string yang bisa di-parse jadi tanggal valid. */
export function isValidDate(date: unknown): boolean {
  const value = typeof date === "string" ? new Date(date) : date
  return value instanceof Date && !Number.isNaN(value.getTime())
}
