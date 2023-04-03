import jwt from 'jsonwebtoken';
import env from '@/env';

type TokenPayload = {
    userId: string;
};

export const createToken = ({ userId }: TokenPayload) => {
    const token = jwt.sign({ userId }, env.TOKEN_SECRET);
    return token;
};

export const verifyToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, env.TOKEN_SECRET);

        if (typeof decoded !== 'string') {
            const payload: TokenPayload = {
                userId: decoded.userId,
            };

            return payload;
        }

        return false;
    } catch (err) {
        return false;
    }
};
