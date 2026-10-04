import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { UnauthorizedError } from '@workspace/errors';
import { IS_PUBLIC_KEY } from '../decorators/public';
import type { JwtPayload } from '../jwt-payload';

/**
 * Guard global: semua route butuh `Authorization: Bearer <token>` kecuali
 * yang ditandai `@Public()`.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (Reflect.getMetadata(IS_PUBLIC_KEY, context.getHandler())) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<Request & { account?: JwtPayload }>();
    const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing Authorization header');
    }

    try {
      request.account = await this.jwtService.verifyAsync<JwtPayload>(
        header.slice(7),
      );
    } catch {
      throw new UnauthorizedError('Invalid or expired token');
    }
    return true;
  }
}
