import { PrismaClient } from '@prisma/client';
import seedUser from '@/seed/seedUser';
import { UserRepository } from '@/repositories';

const prisma = new PrismaClient();

export const INITIAL_CATEGORIES = [
    {
        id: 'b9036a0e-155b-4866-b142-898df4d0e041',
        title: 'Reading' as const,
        color: '#FF5726',
        image: '/static/img/categories/Reading.png',
    },
    {
        id: 'd6026281-85ec-44f4-b556-967729660de3',
        title: 'Meditation' as const,
        color: '#F54336',
        image: '/static/img/categories/Flower.png',
    },
    {
        id: 'c55fcad6-1ec5-4a8c-8adb-50ebcab1bb30',
        title: 'Music' as const,
        color: '#FFC02D',
        image: '/static/img/categories/Music.png',
    },
    {
        id: '26f9dffa-4fcf-4f65-896a-b83ba457f7e9',
        title: 'Tech' as const,
        color: '#CDDC4C',
        image: '/static/img/categories/Laptop.png',
    },
    {
        id: 'c709b2d5-a8af-4b7d-bfbb-44fbb3fb46ff',
        title: 'Coding' as const,
        color: '#00A9F1',
        image: '/static/img/categories/Programming.png',
    },
    {
        id: '5cd4e57c-7c2e-4523-96fb-68eb0b6eaf7e',
        title: 'Creativity' as const,
        color: '#4AAF57',
        image: '/static/img/categories/Design.png',
    },
    {
        id: '32f04418-590b-4c5c-8916-6f8613b2cf42',
        title: 'Entertainment' as const,
        color: '#607D8A',
        image: '/static/img/categories/Smartphone.png',
    },
    {
        id: 'ef45012d-1276-4cb0-87bc-84785658d5f6',
        title: 'Gym' as const,
        color: '#8BC255',
        image: '/static/img/categories/Dumbbell.png',
    },
];

async function main() {
    await prisma.category.createMany({
        data: INITIAL_CATEGORIES,
        skipDuplicates: true,
    });

    const email = 'test@test.com';

    let user = await UserRepository.findByEmail(email);

    if (user) {
        return;
    }

    user = await UserRepository.create({
        email: 'test@test.com',
        password: 'testpassword',
    });

    await UserRepository.update({
        userId: user.id,
        firstName: 'Test',
    });

    await seedUser(user.id);
}

main();
