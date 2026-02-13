import { PrismaClient } from '@prisma/client';

process.on('SIGINT', async () => {
    await PrismaClient.$disconnect();
    process.exit(0);
});

export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Opcional: mostra os comandos SQL no console
});