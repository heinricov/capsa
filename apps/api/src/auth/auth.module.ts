import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AUTH_TOKEN_TTL } from '@workspace/constants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const secret = process.env.JWT_SECRET;
if (!secret || secret.length < 32) {
  throw new Error(
    'JWT_SECRET belum di-set atau terlalu pendek (min 32 char) — cek .env',
  );
}

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret,
      signOptions: { expiresIn: AUTH_TOKEN_TTL },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
