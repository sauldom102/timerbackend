export default {
    PORT: process.env.PORT || 8080,
    TOKEN_SECRET: process.env.TOKEN_SECRET || 'secret',
    NODE_ENV: process.env.NODE_ENV || 'development',
    EMAIL_USER: process.env.EMAIL_USER || '',
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
};
