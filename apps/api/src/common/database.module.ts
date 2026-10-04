import { Global, Module } from '@nestjs/common';
import { prisma } from '@workspace/db';

export const PRISMA = 'PRISMA';
export type PrismaClient = typeof prisma;

@Global()
@Module({
  providers: [{ provide: PRISMA, useValue: prisma }],
  exports: [PRISMA],
})
export class DatabaseModule {}
