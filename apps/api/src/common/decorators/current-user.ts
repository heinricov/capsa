import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { UnauthorizedError } from '@workspace/errors';
import type { JwtPayload } from '../jwt-payload';

/** Ambil payload JWT yang sudah diverifikasi AuthGuard. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const account = ctx
      .switchToHttp()
      .getRequest<{ account?: JwtPayload }>().account;
    if (!account) {
      // Tak tercapai lewat route biasa (AuthGuard selalu mengisi) — defensif.
      throw new UnauthorizedError('Missing account context');
    }
    return account;
  },
);
