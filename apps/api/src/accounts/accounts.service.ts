import { Inject, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { ConflictError, NotFoundError } from '@workspace/errors';
import type { PaginatedResponse, PublicAccount, Role } from '@workspace/types';
import type {
  CreateAccountInput,
  PaginationQuery,
  UpdateAccountInput,
} from '@workspace/validators';
import { ACCOUNT_SELECT, toPublicAccount } from '../common/account.mapper';
import { PRISMA, type PrismaClient } from '../common/database.module';

type AccountUpdateData = {
  name?: string;
  email?: string;
  phone?: string | null;
  password?: string;
  role?: Role;
};

const BCRYPT_ROUNDS = 10;

@Injectable()
export class AccountsService {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  async list(
    query: PaginationQuery,
  ): Promise<PaginatedResponse<PublicAccount>> {
    const { page, limit } = query;
    const [total, rows] = await this.prisma.$transaction([
      this.prisma.account.count(),
      this.prisma.account.findMany({
        select: ACCOUNT_SELECT,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return {
      data: rows.map(toPublicAccount),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async get(id: string): Promise<PublicAccount> {
    const account = await this.prisma.account.findUnique({
      where: { id },
      select: ACCOUNT_SELECT,
    });
    if (account === null) {
      throw new NotFoundError('Account not found');
    }
    return toPublicAccount(account);
  }

  async create(input: CreateAccountInput): Promise<PublicAccount> {
    try {
      const created = await this.prisma.account.create({
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone ?? null,
          password: await bcrypt.hash(input.password, BCRYPT_ROUNDS),
          role: input.role,
        },
        select: ACCOUNT_SELECT,
      });
      return toPublicAccount(created);
    } catch (error) {
      throw this.mapConflict(error);
    }
  }

  async update(id: string, input: UpdateAccountInput): Promise<PublicAccount> {
    await this.get(id);

    const data: AccountUpdateData = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.email !== undefined) data.email = input.email;
    if (input.phone !== undefined) data.phone = input.phone;
    if (input.role !== undefined) data.role = input.role;
    if (input.password !== undefined) {
      data.password = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
    }

    try {
      const updated = await this.prisma.account.update({
        where: { id },
        data,
        select: ACCOUNT_SELECT,
      });
      return toPublicAccount(updated);
    } catch (error) {
      throw this.mapConflict(error);
    }
  }

  async remove(id: string): Promise<{ id: string }> {
    await this.get(id);
    await this.prisma.account.delete({ where: { id } });
    return { id };
  }

  /** Unique constraint (email) → 409 Conflict. */
  private mapConflict(error: unknown): unknown {
    if (
      error &&
      typeof error === 'object' &&
      (error as { code?: unknown }).code === 'P2002'
    ) {
      return new ConflictError('Email already in use');
    }
    return error;
  }
}
