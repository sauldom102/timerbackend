import { CategoryRepository, TaskRepository } from '@/repositories';
import express from 'express';
import { validateRequest } from 'zod-express-middleware';
import httpContext from 'express-http-context';
import {
    AddTaskRegistriesRequest,
    createTaskBodySchema,
    CreateTaskRequest,
    GetListRequest,
    listQuerySchema,
    updateTaskBodySchema,
    UpdateTaskRequest,
} from './schemas';
import { parseISO } from 'date-fns';
import { getPaginationExtra } from '@/lib';

const router = express.Router();

router.post(
    '/',
    validateRequest({
        body: createTaskBodySchema,
    }),
    async (req: CreateTaskRequest, res) => {
        const body = req.body;
        const userId = httpContext.get('userId');

        const categoryExists = await CategoryRepository.existsById(
            body.categoryId
        );

        if (!categoryExists) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const task = await TaskRepository.create({
            title: body.title,
            description: body.description,
            date: parseISO(body.date),
            estimatedDuration: body.estimatedDuration,
            categoryId: body.categoryId,
            userId,
        });

        return res.status(201).json({ status: 'ok', data: task });
    }
);

router.get(
    '/',
    validateRequest({
        query: listQuerySchema,
    }),
    async (req: GetListRequest, res) => {
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;

        const userId = httpContext.get('userId');

        const { tasks, totalTasks } = await TaskRepository.list({
            userId,
            page,
        });

        const extra = getPaginationExtra({ page, totalItems: totalTasks });

        return res.status(200).json({
            status: 'ok',
            data: {
                items: tasks,
                count: totalTasks,
                ...extra,
            },
        });
    }
);

router.get('/today', async (req, res) => {
    const userId = httpContext.get('userId');

    const tasks = await TaskRepository.todayOnly({ userId });

    return res.status(200).json({ status: 'ok', data: tasks });
});

router.get('/stats', async (req, res) => {
    const userId = httpContext.get('userId');

    const stats = await TaskRepository.stats({ userId });

    return res.status(200).json({ status: 'ok', data: stats });
});

router.get('/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    const userId = httpContext.get('userId');

    const task = await TaskRepository.getById({ taskId, userId });

    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    return res.status(200).json({ status: 'ok', data: task });
});

router.put(
    '/:taskId',
    validateRequest({
        body: updateTaskBodySchema,
    }),
    async (req: UpdateTaskRequest, res) => {
        const body = req.body;

        const taskId = req.params.taskId;
        const userId = httpContext.get('userId');

        const taskExists = await TaskRepository.existsById({ taskId, userId });

        if (!taskExists) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const task = await TaskRepository.update({
            taskId,
            completed: body.completed,
        });

        return res.status(200).json({ status: 'ok', data: task });
    }
);

router.delete('/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    const userId = httpContext.get('userId');

    const deleted = await TaskRepository.delete({ taskId, userId });

    return res.status(200).json({ status: 'ok', data: deleted });
});

router.post('/:taskId/reset', async (req, res) => {
    const taskId = req.params.taskId;
    const userId = httpContext.get('userId');

    const exists = await TaskRepository.existsById({ taskId, userId });

    if (!exists) {
        return res.status(404).json({ error: 'Task not found' });
    }

    const task = await TaskRepository.resetTime(taskId);

    return res.status(200).json({ status: 'ok', data: task });
});

router.post(
    '/:taskId/registries',
    async (req: AddTaskRegistriesRequest, res) => {
        const taskId = req.params.taskId;
        const userId = httpContext.get('userId');

        const body = req.body;

        const exists = await TaskRepository.existsById({ taskId, userId });

        if (!exists) {
            return res.status(404).json({ error: 'Task not found' });
        }

        await TaskRepository.addRegistries({
            taskId,
            registries: body,
        });

        const task = await TaskRepository.syncTaskSeconds(taskId);

        return res.status(200).json({ status: 'ok', data: task });
    }
);

export default router;
