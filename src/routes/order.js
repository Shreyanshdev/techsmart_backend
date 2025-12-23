import express from 'express';
import {
    confirmOrder,
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    getOrderTrackingInfo,
    getActiveOrderForUser,
    getMyOrderHistory,
    confirmDeliveryReceipt,
    acceptOrder,
    pickupOrder,
    markOrderAsDelivered,
    getAvailableOrders,
    getCurrentOrders,
    getHistoryOrders,
    updateDeliveryPartnerLocation,
    getOptimizedRoute,
    getGoogleMapsDirections,
    deletePendingOrder,
    getOrderInvoice
} from "../controllers/order/order.js";

import { verifyToken } from "../middleware/auth.js";
import { requireCustomer, requireDeliveryPartner, requireAdmin } from "../middleware/roleAuth.js";

const router = express.Router();

router.use(verifyToken);

// Customer-only routes
router.post("/", requireCustomer, createOrder);
router.get("/active", requireCustomer, getActiveOrderForUser);
router.get("/my-history", requireCustomer, getMyOrderHistory);
router.patch("/:orderId/confirm-receipt", requireCustomer, confirmDeliveryReceipt);
router.delete("/:orderId/pending", requireCustomer, deletePendingOrder); // Safe delete for failed payments
router.get("/:orderId/invoice", requireCustomer, getOrderInvoice); // Get order invoice for customer

// Delivery partner-only routes
router.get("/available/:branchId", requireDeliveryPartner, getAvailableOrders);
router.get("/current/:deliveryPartnerId", requireDeliveryPartner, getCurrentOrders);
router.get("/history/:deliveryPartnerId", requireDeliveryPartner, getHistoryOrders);
router.post("/:orderId/accept", requireDeliveryPartner, acceptOrder);
router.post("/:orderId/pickup", requireDeliveryPartner, pickupOrder);
router.post("/:orderId/delivered", requireDeliveryPartner, markOrderAsDelivered);
router.patch("/:orderId/location", requireDeliveryPartner, updateDeliveryPartnerLocation);
router.post("/:orderId/optimize-route", requireDeliveryPartner, getOptimizedRoute);
router.post("/:orderId/directions", requireDeliveryPartner, getGoogleMapsDirections);

// Shared routes (both customer and delivery partner can access)
router.get("/", getOrders);
router.get("/:orderId", getOrderById);
router.get("/:orderId/tracking", getOrderTrackingInfo);
router.post("/:orderId/confirm", confirmOrder);
router.patch("/:orderId/status", updateOrderStatus);
router.post("/:orderId/directions/customer", getGoogleMapsDirections); // Customer can also get directions for tracking

// Admin-only routes
router.delete('/:orderId', requireAdmin, deleteOrder);

export default router;