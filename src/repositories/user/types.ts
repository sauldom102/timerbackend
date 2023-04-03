export type CreateUserParams = {
    email: string;
    password: string;
};

export type UpdateUserParams = {
    userId: string;
    firstName?: string;
    lastName?: string;
    username?: string;
};
