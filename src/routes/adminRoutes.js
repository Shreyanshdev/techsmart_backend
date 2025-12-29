import express from 'express';
import { getAdminOrderInvoice, getAdminSubscriptionInvoice } from '../controllers/admin/invoiceController.js';
import { getOrdersCSV, getSubscriptionsCSV, getUpcomingDeliveries, getDeliveriesByDate, getDeliveriesCSVByDate } from '../controllers/admin/reportController.js';
import { getDashboardStats, getDeliveriesJSON, getOrdersJSON } from '../controllers/admin/dashboardController.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// Apply requireAdmin middleware to all routes in this router
router.use(requireAdmin);

// Dashboard Stats
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/deliveries', getDeliveriesJSON);
router.get('/dashboard/orders', getOrdersJSON);

// Invoice Preview Routes
router.get('/preview/order/:orderId', getAdminOrderInvoice);
router.get('/preview/subscription/:id', getAdminSubscriptionInvoice);

// CSV Export Routes
router.get('/export/orders', getOrdersCSV);
router.get('/export/subscriptions', getSubscriptionsCSV);

// Reports Routes
router.get('/reports/upcoming-deliveries', getUpcomingDeliveries);
router.get('/reports/deliveries-by-date', getDeliveriesByDate);

// CSV Export for Deliveries by Date
router.get('/export/deliveries-by-date', getDeliveriesCSVByDate);

export default router;

