import { RequestHandler } from 'express';
import httpContext from 'express-http-context';
import { verifyToken as verifyTokenUtil } from '@/lib/jwt';

const verifyToken: RequestHandler = (req, res, next) => {
    const token = req.header('Authorization');

    try {
        if (!token) {
            throw new Error('No auth token provided');
        }

        const payload = verifyTokenUtil(token);

        if (!payload) {
            throw new Error('Not valid auth token provided');
        }

        httpContext.set('userId', payload.userId);

        next();
    } catch (error) {
        res.status(401).json({
            error: 'You are unauthorized to perform this action',
        });
    }
};

export default verifyToken;
