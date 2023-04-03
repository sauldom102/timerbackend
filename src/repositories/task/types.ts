export type CreateTaskParams = {
    title: string;
    description?: string;
    date: Date;
    categoryId: string;
    userId: string;
    estimatedDuration: number;
};

export type GetByIdParams = {
    taskId: string;
    userId: string;
};

export type ExistsByIdParams = {
    taskId: string;
    userId: string;
};

export type TodayOnlyParams = {
    userId: string;
};

export type UpdateParams = {
    taskId: string;
    completed?: boolean;
};

export type DeleteParams = {
    userId: string;
    taskId: string;
};

export type AddRegistries = {
    taskId: string;
    registries: {
        from: string;
        to: string;
        seconds: number;
    }[];
};

export type GetTasksOfWeek = {
    userId: string;
};

export type GetStats = {
    userId: string;
};

export type GetList = {
    userId: string;
    page: number; // from 1
};
