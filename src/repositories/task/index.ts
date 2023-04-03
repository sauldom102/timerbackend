import { PAGE_SIZE } from '@/constants';
import prisma from '@/lib/prisma';
import { addDays, endOfWeek, startOfWeek } from 'date-fns';
import { groupBy, sumBy } from 'lodash';
import CategoryRepository from '../category';
import {
    AddRegistries,
    CreateTaskParams,
    DeleteParams,
    ExistsByIdParams,
    GetByIdParams,
    GetList,
    GetStats,
    GetTasksOfWeek,
    TodayOnlyParams,
    UpdateParams,
} from './types';

class TaskRepository {
    static select = {
        id: true,
        title: true,
        description: true,
        estimatedDuration: true,
        date: true,
        category: {
            select: CategoryRepository.select,
        },
        seconds: true,
        completed: true,
    };

    static orderBy = [
        {
            date: 'desc' as const,
        },
        {
            createdAt: 'desc' as const,
        },
        {
            title: 'asc' as const,
        },
    ];

    static async create(params: CreateTaskParams) {
        const task = await prisma.task.create({
            data: {
                title: params.title,
                description: params.description,
                date: params.date,
                estimatedDuration: params.estimatedDuration,
                user: {
                    connect: {
                        id: params.userId,
                    },
                },
                category: {
                    connect: {
                        id: params.categoryId,
                    },
                },
            },
            select: this.select,
        });

        return task;
    }

    static async list({ userId, page }: GetList) {
        const totalTasks = await prisma.task.count({
            where: {
                userId,
            },
        });

        const tasks = await prisma.task.findMany({
            where: {
                userId,
            },
            orderBy: this.orderBy,
            select: this.select,
            skip: (page - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
            distinct: ['id'],
        });

        return { totalTasks, tasks };
    }

    static async getById({ taskId, userId }: GetByIdParams) {
        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                userId,
            },
            select: this.select,
        });

        return task;
    }

    static async existsById({ taskId, userId }: ExistsByIdParams) {
        const task = await this.getById({ taskId, userId });
        return !!task;
    }

    static async resetTime(taskId: string) {
        const [task] = await Promise.all([
            prisma.task.update({
                where: {
                    id: taskId,
                },
                data: {
                    seconds: 0,
                },
                select: this.select,
            }),
            prisma.taskRegistry.deleteMany({
                where: {
                    taskId,
                },
            }),
        ]);

        return task;
    }

    static async addRegistries({ taskId, registries }: AddRegistries) {
        await prisma.taskRegistry.createMany({
            data: registries.map((registry) => ({
                from: registry.from,
                to: registry.to,
                seconds: registry.seconds,
                taskId,
            })),
            skipDuplicates: true,
        });
    }

    static async syncTaskSeconds(taskId: string) {
        const registries = await prisma.taskRegistry.findMany({
            where: {
                taskId,
            },
            select: {
                seconds: true,
            },
        });

        const totalSeconds = registries.reduce((acc, r) => acc + r.seconds, 0);

        const task = await prisma.task.update({
            where: {
                id: taskId,
            },
            data: {
                seconds: totalSeconds,
            },
            select: this.select,
        });

        return task;
    }

    static async todayOnly({ userId }: TodayOnlyParams) {
        const tasks = await prisma.task.findMany({
            where: {
                userId,
                date: {
                    gte: new Date(new Date().setHours(0, 0, 0)),
                    lte: new Date(new Date().setHours(23, 59, 59)),
                },
            },
            select: this.select,
            orderBy: this.orderBy,
        });

        return tasks;
    }

    static async update({ taskId, ...params }: UpdateParams) {
        const user = await prisma.task.update({
            where: { id: taskId },
            data: {
                ...params,
                completedAt: params.completed ? new Date() : undefined,
            },
            select: this.select,
        });
        return user;
    }

    static async tasksOfTheWeek({ userId }: GetTasksOfWeek) {
        const now = new Date();

        const tasks = await prisma.task.findMany({
            where: {
                userId,
                date: {
                    gte: startOfWeek(now),
                    lte: endOfWeek(now),
                },
            },
        });

        return tasks;
    }

    static async stats({ userId }: GetStats) {
        const now = new Date();

        const weekStart = startOfWeek(now, {
            weekStartsOn: 1,
        });

        const tasks = await prisma.task.findMany({
            where: {
                userId,
                date: {
                    gte: weekStart,
                    lte: endOfWeek(now, {
                        weekStartsOn: 1,
                    }),
                },
            },
        });

        const groupedTasks = Object.entries(
            groupBy(tasks, (task) =>
                task.date.toLocaleDateString('es').substring(0, 10)
            )
        );

        const weeklyMinutes = Array.from({ length: 7 }, (_, i) => {
            const date = addDays(weekStart, i);
            const dateString = date.toLocaleDateString('es').substring(0, 10);

            const group = groupedTasks.find((item) => item[0] === dateString);
            let count = group ? sumBy(group[1], 'seconds') : 0;
            count = Math.ceil(count / 60);
            return count;
        });

        return {
            weeklyMinutes,
        };
    }

    static async delete({ taskId, userId }: DeleteParams) {
        const res = await prisma.task.deleteMany({
            where: {
                id: taskId,
                userId,
            },
        });

        return res.count > 0;
    }
}

export default TaskRepository;
