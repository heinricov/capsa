import { Body, Controller, Get, Post } from '@nestjs/common';
import type { PublicAccount } from '@workspace/client/account';
import {
  type LoginRequest,
  type LoginResponse,
  loginSchema,
} from '@workspace/client/auth';
import type { JwtPayload } from '../common/jwt-payload';
import { CurrentUser } from '../common/decorators/current-user';
import { Public } from '../common/decorators/public';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(
    @Body(new ZodValidationPipe(loginSchema)) body: LoginRequest,
  ): Promise<LoginResponse> {
    return this.authService.login(body);
  }

  @Get('profile')
  profile(@CurrentUser() account: JwtPayload): Promise<PublicAccount> {
    return this.authService.getProfile(account.sub);
  }
}
