import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { CreateUserParams, UpdateUserParams } from './types';

class UserRepository {
    static select = {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        emailConfirmed: true,
        username: true,
        onboarded: true,
    };

    static async create({ email, password }: CreateUserParams) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        return user;
    }

    static async findByEmail(email: string) {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, password: true },
        });
        return user;
    }

    static async update({ userId, ...params }: UpdateUserParams) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                ...params,
                onboarded: true,
            },
            select: this.select,
        });
        return user;
    }

    static async getById(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: this.select,
        });
        return user;
    }
}

export default UserRepository;
