import type { Role } from '@workspace/client/account';

/** Klaim JWT yang disimpan di `request.account` oleh AuthGuard. */
export interface JwtPayload {
  sub: string;
  role: Role;
  email: string;
}
