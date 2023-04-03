import { z } from 'zod';
import { TypedRequestBody } from 'zod-express-middleware';

export const signUpBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export type SignUpRequest = TypedRequestBody<typeof signUpBodySchema>;

export const loginBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export type LoginRequest = TypedRequestBody<typeof loginBodySchema>;
