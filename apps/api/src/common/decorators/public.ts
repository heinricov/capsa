import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Tandai route/controller sebagai publik (tanpa token).
 * Dipakai di `POST /auth/login` dan seluruh route `/accounts`.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
