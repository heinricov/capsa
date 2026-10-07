import { Inject, Injectable } from '@nestjs/common';
import { ConflictError, NotFoundError } from '@workspace/errors';
import type {
  CreateBoxInput,
  PublicBox,
  UpdateBoxInput,
} from '@workspace/client/box';
import type {
  PaginatedResponse,
  PaginationQuery,
} from '@workspace/client/common';
import { BOX_SELECT, toPublicBox } from './box.mapper';
import { PRISMA, type PrismaClient } from '../common/database.module';

type BoxUpdateData = {
  userId?: string;
  no?: string;
  description?: string | null;
};

@Injectable()
export class BoxesService {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  async list(query: PaginationQuery): Promise<PaginatedResponse<PublicBox>> {
    const { page, limit } = query;
    const [total, rows] = await this.prisma.$transaction([
      this.prisma.box.count(),
      this.prisma.box.findMany({
        select: BOX_SELECT,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return {
      data: rows.map(toPublicBox),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async get(id: string): Promise<PublicBox> {
    const box = await this.prisma.box.findUnique({
      where: { id },
      select: BOX_SELECT,
    });
    if (box === null) {
      throw new NotFoundError('Box not found');
    }
    return toPublicBox(box);
  }

  async create(input: CreateBoxInput): Promise<PublicBox> {
    try {
      const created = await this.prisma.box.create({
        data: {
          userId: input.userId,
          no: input.no,
          description: input.description ?? null,
        },
        select: BOX_SELECT,
      });
      return toPublicBox(created);
    } catch (error) {
      throw this.mapConflict(error);
    }
  }

  async update(id: string, input: UpdateBoxInput): Promise<PublicBox> {
    await this.get(id);

    const data: BoxUpdateData = {};
    if (input.userId !== undefined) data.userId = input.userId;
    if (input.no !== undefined) data.no = input.no;
    if (input.description !== undefined) data.description = input.description;

    try {
      const updated = await this.prisma.box.update({
        where: { id },
        data,
        select: BOX_SELECT,
      });
      return toPublicBox(updated);
    } catch (error) {
      throw this.mapConflict(error);
    }
  }

  async remove(id: string): Promise<{ id: string }> {
    await this.get(id);
    await this.prisma.box.delete({ where: { id } });
    return { id };
  }

  /** Unique constraint (no) → 409 Conflict. */
  private mapConflict(error: unknown): unknown {
    if (
      error &&
      typeof error === 'object' &&
      (error as { code?: unknown }).code === 'P2002'
    ) {
      return new ConflictError('Box number already in use');
    }
    return error;
  }
}
