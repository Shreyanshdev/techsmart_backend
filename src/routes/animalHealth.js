import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
    getAnimalHealthByProduct,
    getMySubscribedProductsHealth,
    createAnimalHealth,
    updateAnimalHealth,
    deleteAnimalHealth
} from '../controllers/animalHealth/animalHealth.js';

const router = express.Router();

// Customer routes (requires subscription)
router.get('/my-products', verifyToken, getMySubscribedProductsHealth);
router.get('/product/:productId', verifyToken, getAnimalHealthByProduct);

// Admin routes (no admin check here - handled by AdminJS)
router.post('/', verifyToken, createAnimalHealth);
router.put('/:id', verifyToken, updateAnimalHealth);
router.delete('/:id', verifyToken, deleteAnimalHealth);

export default router;
