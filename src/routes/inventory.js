import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
    createInventory,
    getBranchInventory,
    getInventoryById,
    updateInventory,
    updateStock,
    bulkUpdateInventory,
    deleteInventory,
    getProductAvailability
} from '../controllers/inventory.js';

const router = express.Router();

// Public routes
router.get('/branch/:branchId', getBranchInventory);
router.get('/product/:productId/availability', getProductAvailability);
router.get('/:id', getInventoryById);

// Admin routes (protected)
router.post('/', verifyToken, createInventory);
router.put('/:id', verifyToken, updateInventory);
router.patch('/:id/stock', verifyToken, updateStock);
router.post('/bulk-update', verifyToken, bulkUpdateInventory);
router.delete('/:id', verifyToken, deleteInventory);

export default router;
