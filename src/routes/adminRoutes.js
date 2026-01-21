import express from 'express';
import { getAdminOrderInvoice } from '../controllers/admin/invoiceController.js';
import { getOrdersCSV } from '../controllers/admin/reportController.js';
import { getDashboardStats, getOrdersJSON } from '../controllers/admin/dashboardController.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// Apply requireAdmin middleware to all routes in this router
router.use(requireAdmin);

// Dashboard Stats
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/orders', getOrdersJSON);

// Invoice Preview Routes
router.get('/preview/order/:orderId', getAdminOrderInvoice);

// CSV Export Routes
router.get('/export/orders', getOrdersCSV);

// Reports Routes are moved or removed as they related to deliveries

export default router;

