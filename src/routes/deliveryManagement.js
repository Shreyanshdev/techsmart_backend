import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { requireCustomer } from '../middleware/roleAuth.js';
import {
    getDeliveryDetails,
    changeDeliverySlot,
    rescheduleDelivery,
    rescheduleMultipleDeliveries,
    getUpcomingDeliveries,
    getDeliveryCalendar,
    confirmDeliveryByCustomer
} from '../controllers/subscription/deliveryManagement.js';

const router = express.Router();

// All delivery management routes are customer-only
router.use(verifyToken);
router.use(requireCustomer);

// Get upcoming deliveries for calendar view
router.get('/:subscriptionId/upcoming', getUpcomingDeliveries);

// Get delivery calendar data for a specific month
router.get('/:subscriptionId/calendar', getDeliveryCalendar);

// Reschedule multiple deliveries (bulk)
router.patch('/:subscriptionId/reschedule', rescheduleMultipleDeliveries);

// Get delivery details for a specific date
router.get('/:subscriptionId/:deliveryDate', getDeliveryDetails);

// Change delivery slot for a specific date
router.patch('/:subscriptionId/:deliveryDate/slot', changeDeliverySlot);

// Reschedule a single delivery
router.patch('/:subscriptionId/:deliveryDate/reschedule', rescheduleDelivery);

// Confirm delivery by customer
router.post('/:subscriptionId/:deliveryDate/confirm', confirmDeliveryByCustomer);

export default router;
