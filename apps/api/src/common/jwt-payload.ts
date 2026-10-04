import type { Role } from '@workspace/types';

/** Klaim JWT yang disimpan di `request.account` oleh AuthGuard. */
export interface JwtPayload {
  sub: string;
  role: Role;
  email: string;
}
