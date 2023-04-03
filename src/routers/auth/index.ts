import express from 'express';
import bcrypt from 'bcryptjs';
import {
    loginBodySchema,
    LoginRequest,
    signUpBodySchema,
    SignUpRequest,
} from './schemas';
import { validateRequest } from 'zod-express-middleware';
import UserRepository from '@/repositories/user';
import { createToken } from '@/lib';
import seedUser from '@/seed/seedUser';

const router = express.Router();

router.post(
    '/sign-up',
    validateRequest({
        body: signUpBodySchema,
    }),
    async (req: SignUpRequest, res) => {
        const body = req.body;

        const user = await UserRepository.create({
            email: body.email,
            password: body.password,
        });

        if (!user) {
            return;
        }

        // Populate user
        await seedUser(user.id);

        const accessToken = createToken({
            userId: user.id,
        });

        res.status(201).json({ status: 'ok', data: accessToken });
    }
);

router.post(
    '/login',
    validateRequest({
        body: loginBodySchema,
    }),
    async (req: LoginRequest, res) => {
        const body = req.body;

        const user = await UserRepository.findByEmail(body.email);

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(
            body.password,
            user.password
        );
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const accessToken = createToken({
            userId: user.id,
        });

        res.status(200).json({ status: 'ok', data: accessToken });
    }
);

export default router;
