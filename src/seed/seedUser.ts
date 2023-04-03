import prisma from '@/lib/prisma';
import { INITIAL_CATEGORIES } from 'prisma/seed';
import subSeconds from 'date-fns/subSeconds';
import subDays from 'date-fns/subDays';

const TASK_DESCRIPTION =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam efficitur orci quis porta fringilla. Vestibulum fringilla tortor risus, eu eleifend tortor feugiat feugiat. Cras volutpat elit purus, et pulvinar eros pharetra eu.';

const seedUser = async (userId: string) => {
    const now = new Date();

    let tasks = [
        {
            title: 'Reading books',
            categoryId:
                INITIAL_CATEGORIES.find((c) => c.title === 'Reading')?.id ?? '',
            seconds: 50 * 60,
            estimatedDuration: 60 * 60,
        },
        {
            title: 'Editing audio',
            categoryId:
                INITIAL_CATEGORIES.find((c) => c.title === 'Music')?.id ?? '',
            seconds: 75 * 60,
            estimatedDuration: 120 * 60,
        },
        {
            title: 'Dumbbell Exercise',
            categoryId:
                INITIAL_CATEGORIES.find((c) => c.title === 'Gym')?.id ?? '',
            seconds: 25 * 60,
            estimatedDuration: 90 * 60,
        },
        {
            title: 'Meditation',
            categoryId:
                INITIAL_CATEGORIES.find((c) => c.title === 'Meditation')?.id ??
                '',
            seconds: 25 * 60,
            estimatedDuration: 30 * 60,
        },
        {
            title: 'Tech Exploration',
            categoryId:
                INITIAL_CATEGORIES.find((c) => c.title === 'Tech')?.id ?? '',
            seconds: 50 * 60,
            estimatedDuration: 60 * 60,
        },
    ].map((task) => ({
        ...task,
        description: TASK_DESCRIPTION,
        date: now,
        userId,
    }));

    // add some tasks for yesterday
    tasks = [
        ...tasks,
        ...tasks.map((task) => ({
            ...task,
            date: subDays(task.date, 1),
        })),
    ];

    await prisma.task.createMany({
        data: tasks,
        skipDuplicates: true,
    });

    const newTasks = await prisma.task.findMany({
        where: {
            userId,
        },
    });

    // it is actually not possible with real app usage
    // to have overlapping task registries, but it is fine
    // for seed data
    await prisma.taskRegistry.createMany({
        data: newTasks.map((task) => ({
            from: subSeconds(now, task.seconds),
            to: now,
            seconds: task.seconds,
            taskId: task.id,
        })),
    });
};

export default seedUser;
