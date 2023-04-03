import { z, ZodTypeAny } from 'zod';
import { TypedRequestBody, TypedRequestQuery } from 'zod-express-middleware';

export const createTaskBodySchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    estimatedDuration: z.number(),
    date: z.string().datetime(),
    categoryId: z.string(),
});

export type CreateTaskRequest = TypedRequestBody<typeof createTaskBodySchema>;

export const addTaskRegistriesBodySchema = z.array(
    z.object({
        from: z.string().datetime(),
        to: z.string().datetime(),
        seconds: z.number().int(),
    })
);

export type AddTaskRegistriesRequest = TypedRequestBody<
    typeof addTaskRegistriesBodySchema
>;

export const updateTaskBodySchema = z.object({
    completed: z.boolean().optional(),
});

export type UpdateTaskRequest = TypedRequestBody<typeof updateTaskBodySchema>;

const numericString = (schema: ZodTypeAny) =>
    z.preprocess((a) => {
        if (typeof a === 'string') {
            return parseInt(a, 10);
        } else if (typeof a === 'number') {
            return a;
        } else {
            return undefined;
        }
    }, schema);

export const listQuerySchema = z.object({
    page: numericString(z.number().int().min(1)).optional(),
});

export type GetListRequest = TypedRequestQuery<typeof listQuerySchema>;
