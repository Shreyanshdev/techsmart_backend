import express from 'express';
import { getBanners, upsertBanner, seedBanners } from '../controllers/banner/banner.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getBanners);
router.post('/', verifyToken, upsertBanner);
router.post('/seed', seedBanners);

export default router;
