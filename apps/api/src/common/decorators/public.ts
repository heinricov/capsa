import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Tandai route sebagai publik (tanpa token) — hanya dipakai di POST /auth/login. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
