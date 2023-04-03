import { CategoryRepository } from '@/repositories';
import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
    const body = req.body;

    const categories = await CategoryRepository.getAll();

    return res.status(200).json({ status: 'ok', data: categories });
});

export default router;
