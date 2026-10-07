import type { Box, PublicBox } from '@workspace/client/box';

/** Pilihan select Prisma — tanpa field sensitif. */
export const BOX_SELECT = {
  id: true,
  userId: true,
  no: true,
  description: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type BoxRow = Omit<Box, never>;

export function toPublicBox(box: BoxRow): PublicBox {
  return {
    id: box.id,
    userId: box.userId,
    no: box.no,
    description: box.description,
    createdAt: box.createdAt,
    updatedAt: box.updatedAt,
  };
}
