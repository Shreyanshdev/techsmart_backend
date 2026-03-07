import express from 'express';
import { getHomeLayoutFeed, seedHomeLayout, upsertSection, deleteSection } from '../controllers/homeLayout.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public: Get home layout feed
router.get('/feed', getHomeLayoutFeed);

// Admin: Seed sample sections
router.post('/seed', seedHomeLayout);

// Admin: Create/Update section
router.post('/', verifyToken, upsertSection);

// Admin: Delete section
router.delete('/:id', verifyToken, deleteSection);

export default router;
