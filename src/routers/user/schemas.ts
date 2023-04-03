import { z } from 'zod';
import { TypedRequestBody } from 'zod-express-middleware';

export const updateUserBodySchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    username: z.string().optional(),
});

export type UpdateUserRequest = TypedRequestBody<typeof updateUserBodySchema>;
