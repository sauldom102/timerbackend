import { PrismaClient } from '.prisma/client';
import env from '@/env';

declare global {
    var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

export default prisma;

if (env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}
