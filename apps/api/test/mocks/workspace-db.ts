/**
 * Mock @workspace/db untuk test — test e2e tidak menyentuh database.
 * Semua method melempar error agar tak ada test yang diam-demi mengandalkan DB.
 */
const boom = (): never => {
  throw new Error('Database tidak tersedia di test (mock @workspace/db)');
};

export const prisma = {
  account: {
    findUnique: boom,
    findMany: boom,
    create: boom,
    update: boom,
    delete: boom,
    deleteMany: boom,
    upsert: boom,
    count: boom,
  },
  $transaction: boom,
  $disconnect: boom,
};
