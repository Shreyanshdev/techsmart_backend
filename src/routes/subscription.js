import express from "express";
import {
  createEnhancedSubscription,
  getSubscription,
  getSubscriptionByCustomer,
  getSubscriptionsByCurrentCustomer,
  getSubscriptionHistory,
  getSubscriptionInvoice,
  updateSubscription,
  deleteSubscription,
  forceDeleteSubscription,
  startDelivery,
  markDeliveryDelivered,
  assignDeliveryPartner,
  updateDeliveryStatuses,
  startDeliveryJourney,
  getPartnerScheduledDeliveries,
  getPartnerCompletedDeliveries,
  confirmDeliveryByCustomer,
  getDailySubscriptionDeliveriesForPartner,
  getNearestBranch,
  updateLiveLocation,
  confirmDeliveryReceipt,
  validateDeliveryCounts,
  markDeliveryNoResponse,
  confirmPickup,
  updateRealTimeLocation,
  getActiveSubscriptionsForPartner,

  getAvailableRescheduleDates,
  getDeliveryDetails,
  getSubscriptionScheduledDeliveries,
  getSubscriptionDirections,
  geocodeSubscriptionAddress,
  getSubscriptionDeliveryHistory,
  addProductToExistingSubscription,
} from "../controllers/subscription/subscription.js";

import { verifyToken } from "../middleware/auth.js";
import { requireCustomer, requireDeliveryPartner } from "../middleware/roleAuth.js";

const router = express.Router();

router.use(verifyToken);

// Utility routes (public for authenticated users)
router.get("/nearest-branch", getNearestBranch);
router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API connection successful",
    timestamp: new Date().toISOString()
  });
});
router.post("/geocode", geocodeSubscriptionAddress);

// Customer-only routes
router.post("/", requireCustomer, createEnhancedSubscription);
router.get("/my", requireCustomer, getSubscriptionsByCurrentCustomer);
router.get("/history", requireCustomer, getSubscriptionHistory);
router.get("/:id/invoice", requireCustomer, getSubscriptionInvoice);

router.get("/available-reschedule-dates", requireCustomer, getAvailableRescheduleDates);
router.put("/:id", requireCustomer, updateSubscription);
router.delete("/:id", requireCustomer, deleteSubscription);
router.delete("/:id/force", requireCustomer, forceDeleteSubscription);

// Add product to existing subscription (requires payment verification)
router.post("/:id/add-product", requireCustomer, addProductToExistingSubscription);

// Delivery partner-only routes
router.get("/partners/:partnerId/active", requireDeliveryPartner, getActiveSubscriptionsForPartner);
router.get("/partners/:partnerId/deliveries/scheduled", requireDeliveryPartner, getPartnerScheduledDeliveries);
router.get("/partners/:partnerId/deliveries/completed", requireDeliveryPartner, getPartnerCompletedDeliveries);
router.get("/partners/:partnerId/deliveries/daily", requireDeliveryPartner, getDailySubscriptionDeliveriesForPartner);
router.post("/deliveries/start", requireDeliveryPartner, startDelivery);
router.post("/deliveries/delivered", requireDeliveryPartner, markDeliveryDelivered);
router.post("/deliveries/no-response", requireDeliveryPartner, markDeliveryNoResponse);
router.post("/deliveries/assign-partner", requireDeliveryPartner, assignDeliveryPartner);
router.post("/deliveries/journey/start", requireDeliveryPartner, startDeliveryJourney);
router.post("/deliveries/update-statuses", requireDeliveryPartner, updateDeliveryStatuses);
router.post("/deliveries/pickup/confirm", requireDeliveryPartner, confirmPickup);
router.post("/deliveries/location", requireDeliveryPartner, updateLiveLocation);
router.post("/deliveries/location/realtime", requireDeliveryPartner, updateRealTimeLocation);

// Customer confirmation routes
router.post("/deliveries/confirm", requireCustomer, confirmDeliveryByCustomer);
router.post("/deliveries/confirm-receipt", requireCustomer, confirmDeliveryReceipt);

// Shared routes (specific subscription access)
router.get("/", getSubscription);
router.get("/customer/:customerId", getSubscriptionByCustomer);
router.get("/:id", getSubscription);
router.get("/:id/validate-counts", validateDeliveryCounts);
router.get("/:id/deliveries/:deliveryDate", getDeliveryDetails);
router.get("/:id/deliveries/scheduled", getSubscriptionScheduledDeliveries);
router.get("/:id/history", getSubscriptionDeliveryHistory);
router.post("/:id/directions", getSubscriptionDirections);

export default router;