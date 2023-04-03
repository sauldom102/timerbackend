import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

class CategoryRepository {
    static select = {
        id: true,
        title: true,
        color: true,
        image: true,
    };

    static async getAll() {
        const categories = await prisma.category.findMany({
            select: this.select,
        });
        return categories;
    }

    static async existsById(id: string) {
        const category = await prisma.category.findUnique({
            where: {
                id,
            },
        });

        return !!category;
    }
}

export default CategoryRepository;
