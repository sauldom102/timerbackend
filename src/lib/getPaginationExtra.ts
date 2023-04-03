import { PAGE_SIZE } from '@/constants';

type Params = {
    page: number;
    totalItems: number;
};

const getPaginationExtra = ({ page, totalItems }: Params) => {
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);

    const nextPage = page < totalPages ? page + 1 : null;

    const prevPage = page > 1 ? page - 1 : null;

    return {
        nextPage,
        prevPage,
        totalPages,
    };
};

export default getPaginationExtra;
