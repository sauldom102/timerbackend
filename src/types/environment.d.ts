declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN_SECRET: string;
            EMAIL_USER: string;
            EMAIL_PASSWORD: string;
        }
    }
}

export {};
