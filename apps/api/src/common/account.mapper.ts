import type { Account, PublicAccount } from '@workspace/types';

/** Pilihan select Prisma — tanpa `password`, tidak pernah ikut ke response. */
export const ACCOUNT_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type AccountRow = Omit<Account, 'password'>;

export function toPublicAccount(account: AccountRow): PublicAccount {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    phone: account.phone,
    role: account.role,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
}
