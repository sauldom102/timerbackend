import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import httpContext from 'express-http-context';
import {
    authRouter,
    categoriesRouter,
    tasksRouter,
    userRouter,
} from '@/routers';
import { verifyToken } from '@/middlewares';

const app = express();

app.use(helmet());
app.use(cors());

cors({ credentials: true, origin: true });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use(httpContext.middleware);

app.use('/auth', authRouter);

app.use('/tasks', verifyToken, tasksRouter);
app.use('/categories', verifyToken, categoriesRouter);
app.use('/user', verifyToken, userRouter);

export default app;
