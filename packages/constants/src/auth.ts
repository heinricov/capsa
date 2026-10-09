/** TTL JWT — dipakai `signOptions.expiresIn` di API (Nest JwtModule). */
export const AUTH_TOKEN_TTL = "24h"

/**
 * AUTH_TOKEN_TTL dalam detik — dipakai `maxAge` cookie token di web.
 * Harus selalu sinkron dengan AUTH_TOKEN_TTL.
 */
export const AUTH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24

/** Nama cookie penyimpanan token JWT di web. */
export const AUTH_COOKIE_NAME = "capsa_token"

/** Key penyimpanan token JWT di mobile (expo-secure-store). */
export const AUTH_STORAGE_KEY = "capsa_token"
