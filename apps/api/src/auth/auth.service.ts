import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { UnauthorizedError } from '@workspace/errors';
import type {
  LoginRequest,
  LoginResponse,
  PublicAccount,
} from '@workspace/types';
import { ACCOUNT_SELECT, toPublicAccount } from '../common/account.mapper';
import { PRISMA, type PrismaClient } from '../common/database.module';

@Injectable()
export class AuthService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    private readonly jwtService: JwtService,
  ) {}

  async login(body: LoginRequest): Promise<LoginResponse> {
    const account = await this.prisma.account.findUnique({
      where: { email: body.email },
    });
    const valid =
      account !== null &&
      (await bcrypt.compare(body.password, account.password));
    if (!account || !valid) {
      // Pesan generik — tidak membocorkan email tak terdaftar vs password salah.
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = await this.jwtService.signAsync({
      sub: account.id,
      role: account.role,
      email: account.email,
    });
    return { token, account: toPublicAccount(account) };
  }

  async getProfile(accountId: string): Promise<PublicAccount> {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      select: ACCOUNT_SELECT,
    });
    if (account === null) {
      throw new UnauthorizedError('Account no longer exists');
    }
    return toPublicAccount(account);
  }
}
