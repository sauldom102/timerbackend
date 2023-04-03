import { UserRepository } from '@/repositories';
import express from 'express';
import { validateRequest } from 'zod-express-middleware';
import httpContext from 'express-http-context';
import { updateUserBodySchema, UpdateUserRequest } from './schemas';

const router = express.Router();

router.put(
    '/',
    validateRequest({
        body: updateUserBodySchema,
    }),
    async (req: UpdateUserRequest, res) => {
        const body = req.body;
        const userId = httpContext.get('userId');

        const user = await UserRepository.update({
            userId,
            firstName: body.firstName,
            lastName: body.lastName,
            username: body.username,
        });

        return res.status(200).json({ status: 'ok', data: user });
    }
);

router.get('/', async (req, res) => {
    const userId = httpContext.get('userId');

    const user = await UserRepository.getById(userId);

    return res.status(200).json({ status: 'ok', data: user });
});

export default router;
