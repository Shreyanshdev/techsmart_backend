import Subscription from "../../models/subscription.js";
import { Customer, DeliveryPartner } from "../../models/user.js";
import mongoose from 'mongoose';
import {
    updateSubscriptionEndDate,
    isPastCutoffTime,
    isWithinRescheduleLimit,
    calculateCutoffTime
} from './helpers.js';


// Get delivery details for a specific date
export const getDeliveryDetails = async (req, res) => {
    try {
        const { subscriptionId, deliveryDate } = req.params;
        const customerId = req.user._id;

        // Find subscription and verify ownership
        const subscription = await Subscription.findOne({
            _id: subscriptionId,
            customer: customerId
        }).populate('deliveryAddress', 'addressLine1 addressLine2 city state zipCode latitude longitude')
            .populate('deliveryPartner.partner', 'name phone');

        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }

        // Find the specific delivery
        const targetDate = new Date(deliveryDate);
        const delivery = subscription.deliveries.find(d => {
            const deliveryDate = new Date(d.date);
            return deliveryDate.toDateString() === targetDate.toDateString();
        });

        if (!delivery) {
            return res.status(404).json({ message: "Delivery not found for this date" });
        }

        // Check if delivery is in the past
        const now = new Date();
        const isPastDelivery = new Date(delivery.date) < now;

        // Check if past cutoff time (only for today's deliveries)
        const pastCutoff = isPastCutoffTime(delivery.cutoffTime, delivery.date);

        res.json({
            success: true,
            delivery: {
                ...delivery.toObject(),
                isPastDelivery,
                pastCutoff,
                canModify: !isPastDelivery && !pastCutoff,
                subscription: {
                    subscriptionId: subscription.subscriptionId,
                    slot: subscription.slot,
                    status: subscription.status
                }
            }
        });

    } catch (error) {
        console.error('Error getting delivery details:', error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Change delivery slot for a specific date
export const changeDeliverySlot = async (req, res) => {
    try {
        const { subscriptionId, deliveryDate } = req.params;
        const { newSlot } = req.body;
        const customerId = req.user._id;

        // Validate slot
        if (!['morning', 'evening'].includes(newSlot.toLowerCase())) {
            return res.status(400).json({ message: "Invalid slot. Must be 'morning' or 'evening'" });
        }

        // Find subscription and verify ownership
        const subscription = await Subscription.findOne({
            _id: subscriptionId,
            customer: customerId
        });

        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }

        // Find the specific delivery (normalize date to avoid timezone issues)
        const parseAsLocalDate = (input) => {
            if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
                const [y, m, d] = input.split('-').map(Number);
                // Create date in local timezone at 00:00
                return new Date(y, m - 1, d);
            }
            return new Date(input);
        };

        const isSameCalendarDay = (a, b) =>
            a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate();

        const targetDate = parseAsLocalDate(deliveryDate);
        let deliveryIndex = subscription.deliveries.findIndex(d => {
            const dDate = parseAsLocalDate(d.date);
            return isSameCalendarDay(dDate, targetDate);
        });

        if (deliveryIndex === -1) {
            // Fallback: try ISO yyyy-mm-dd matching and log candidates
            const paramYmd = typeof deliveryDate === 'string' && deliveryDate.length >= 10
                ? deliveryDate.slice(0, 10)
                : null;
            if (paramYmd) {
                deliveryIndex = subscription.deliveries.findIndex(d => {
                    const dv = d.date;
                    if (!dv) return false;
                    if (typeof dv === 'string') return dv.slice(0, 10) === paramYmd;
                    try { return new Date(dv).toISOString().slice(0, 10) === paramYmd; } catch { return false; }
                });
            }
            if (deliveryIndex === -1) {
                console.warn('⚠️ changeDeliverySlot: Delivery not found for date', deliveryDate, {
                    subscriptionId,
                    candidates: subscription.deliveries.slice(0, 50).map(d => ({
                        raw: d.date,
                        iso: (() => { try { return new Date(d.date).toISOString(); } catch { return null; } })(),
                        ymd: (() => { try { return new Date(d.date).toISOString().slice(0, 10); } catch { return (typeof d.date === 'string' ? d.date.slice(0, 10) : null); } })()
                    }))
                });
                return res.status(404).json({ message: "Delivery not found for this date" });
            }
        }

        const delivery = subscription.deliveries[deliveryIndex];

        // Check if delivery is in the past
        const now = new Date();
        const isPastDelivery = new Date(delivery.date) < now;

        if (isPastDelivery) {
            return res.status(400).json({
                message: "Cannot modify past deliveries",
                canModify: false
            });
        }

        // Check if past cutoff time (only for today's deliveries)
        if (isPastCutoffTime(delivery.cutoffTime, delivery.date)) {
            return res.status(400).json({
                message: "Cannot change slot for today's delivery after cutoff time (2 hours before delivery)",
                canModify: false,
                cutoffTime: delivery.cutoffTime
            });
        }

        // Update the delivery slot and recalculate cutoff time
        const newCutoffTime = calculateCutoffTime(delivery.date, newSlot);

        subscription.deliveries[deliveryIndex].slot = newSlot.toLowerCase();
        subscription.deliveries[deliveryIndex].cutoffTime = newCutoffTime;

        await subscription.save();

        res.json({
            success: true,
            message: "Delivery slot changed successfully",
            delivery: {
                date: delivery.date,
                slot: newSlot.toLowerCase(),
                cutoffTime: newCutoffTime
            }
        });

    } catch (error) {
        console.error('Error changing delivery slot:', error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Reschedule a single delivery
export const rescheduleDelivery = async (req, res) => {
    try {
        const { subscriptionId, deliveryDate } = req.params;
        const { newDate, newSlot } = req.body;
        const customerId = req.user._id;

        // Validate inputs
        if (!newDate) {
            return res.status(400).json({ message: "New date is required" });
        }

        const slot = newSlot || 'morning'; // Default to morning if not specified
        if (!['morning', 'evening'].includes(slot.toLowerCase())) {
            return res.status(400).json({ message: "Invalid slot. Must be 'morning' or 'evening'" });
        }

        // Find subscription and verify ownership
        const subscription = await Subscription.findOne({
            _id: subscriptionId,
            customer: customerId
        });

        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }

        // Find the specific delivery (normalize date to avoid timezone issues)
        const parseAsLocalDate = (input) => {
            if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
                const [y, m, d] = input.split('-').map(Number);
                return new Date(y, m - 1, d);
            }
            return new Date(input);
        };

        const isSameCalendarDay = (a, b) =>
            a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate();

        const targetDate = parseAsLocalDate(deliveryDate);
        let deliveryIndex = subscription.deliveries.findIndex(d => {
            const dDate = parseAsLocalDate(d.date);
            return isSameCalendarDay(dDate, targetDate);
        });

        if (deliveryIndex === -1) {
            const paramYmd = typeof deliveryDate === 'string' && deliveryDate.length >= 10
                ? deliveryDate.slice(0, 10)
                : null;
            if (paramYmd) {
                deliveryIndex = subscription.deliveries.findIndex(d => {
                    const dv = d.date;
                    if (!dv) return false;
                    if (typeof dv === 'string') return dv.slice(0, 10) === paramYmd;
                    try { return new Date(dv).toISOString().slice(0, 10) === paramYmd; } catch { return false; }
                });
            }
            if (deliveryIndex === -1) {
                console.warn('⚠️ rescheduleDelivery: Delivery not found for date', deliveryDate, {
                    subscriptionId,
                    candidates: subscription.deliveries.slice(0, 50).map(d => ({
                        raw: d.date,
                        iso: (() => { try { return new Date(d.date).toISOString(); } catch { return null; } })(),
                        ymd: (() => { try { return new Date(d.date).toISOString().slice(0, 10); } catch { return (typeof d.date === 'string' ? d.date.slice(0, 10) : null); } })()
                    }))
                });
                return res.status(404).json({ message: "Delivery not found for this date" });
            }
        }

        if (deliveryIndex === -1) {
            return res.status(404).json({ message: "Delivery not found for this date" });
        }

        const delivery = subscription.deliveries[deliveryIndex];

        // Check if delivery is in the past
        const now = new Date();
        const isPastDelivery = new Date(delivery.date) < now;

        if (isPastDelivery) {
            return res.status(400).json({
                message: "Cannot reschedule past deliveries",
                canModify: false
            });
        }

        // Check if past cutoff time (only for today's deliveries)
        if (isPastCutoffTime(delivery.cutoffTime, delivery.date)) {
            return res.status(400).json({
                message: "Cannot reschedule today's delivery after cutoff time (2 hours before delivery)",
                canModify: false,
                cutoffTime: delivery.cutoffTime
            });
        }

        // Check if new date is within 2 months limit
        if (!isWithinRescheduleLimit(delivery.date, newDate)) {
            return res.status(400).json({
                message: "New date must be within 2 months from original delivery date and not in the past",
                canModify: false
            });
        }

        // Check if there's already a delivery on the new date
        const newDeliveryDate = new Date(newDate);
        const existingDelivery = subscription.deliveries.find(d => {
            const existingDate = new Date(d.date);
            return existingDate.toDateString() === newDeliveryDate.toDateString();
        });

        if (existingDelivery) {
            return res.status(400).json({
                message: "A delivery already exists on the selected date",
                canModify: false
            });
        }

        // Update the delivery
        const newCutoffTime = calculateCutoffTime(newDate, slot);

        subscription.deliveries[deliveryIndex].date = newDeliveryDate;
        subscription.deliveries[deliveryIndex].slot = slot.toLowerCase();
        subscription.deliveries[deliveryIndex].cutoffTime = newCutoffTime;
        subscription.deliveries[deliveryIndex].status = 'scheduled'; // Reset status

        // Sort deliveries by date
        subscription.deliveries.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Update subscription end date based on the last scheduled delivery
        updateSubscriptionEndDate(subscription);

        await subscription.save();

        res.json({
            success: true,
            message: "Delivery rescheduled successfully",
            delivery: {
                originalDate: deliveryDate,
                newDate: newDeliveryDate,
                slot: slot.toLowerCase(),
                cutoffTime: newCutoffTime
            }
        });

    } catch (error) {
        console.error('Error rescheduling delivery:', error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Reschedule multiple deliveries (bulk reschedule)
export const rescheduleMultipleDeliveries = async (req, res) => {
    try {
        const { subscriptionId } = req.params;
        const {
            deliveryDates, // Array of dates to reschedule
            newStartDate,  // New start date for the range
            newSlot,       // New slot for all deliveries
            rescheduleType // 'shift' or 'replace'
        } = req.body;
        const customerId = req.user._id;

        // Validate inputs
        if (!deliveryDates || !Array.isArray(deliveryDates) || deliveryDates.length === 0) {
            return res.status(400).json({ message: "Delivery dates array is required" });
        }

        if (!newStartDate) {
            return res.status(400).json({ message: "New start date is required" });
        }

        const slot = newSlot || 'morning';
        if (!['morning', 'evening'].includes(slot.toLowerCase())) {
            return res.status(400).json({ message: "Invalid slot. Must be 'morning' or 'evening'" });
        }

        // Find subscription and verify ownership
        const subscription = await Subscription.findOne({
            _id: subscriptionId,
            customer: customerId
        });

        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }

        const now = new Date();
        const results = [];
        const errors = [];

        // Process each delivery
        for (const deliveryDate of deliveryDates) {
            try {
                const targetDate = new Date(deliveryDate);
                const deliveryIndex = subscription.deliveries.findIndex(d => {
                    const dDate = new Date(d.date);
                    return dDate.toDateString() === targetDate.toDateString();
                });

                if (deliveryIndex === -1) {
                    errors.push({ date: deliveryDate, error: "Delivery not found" });
                    continue;
                }

                const delivery = subscription.deliveries[deliveryIndex];

                // Check if delivery is in the past
                const isPastDelivery = new Date(delivery.date) < now;
                if (isPastDelivery) {
                    errors.push({ date: deliveryDate, error: "Cannot reschedule past deliveries" });
                    continue;
                }

                // Check if past cutoff time (only for today's deliveries)
                if (isPastCutoffTime(delivery.cutoffTime, delivery.date)) {
                    errors.push({ date: deliveryDate, error: "Past cutoff time for today's delivery" });
                    continue;
                }

                // Calculate new date based on reschedule type
                let newDate;
                if (rescheduleType === 'shift') {
                    // Shift all deliveries by the same number of days
                    const daysDiff = Math.floor((new Date(newStartDate) - new Date(deliveryDates[0])) / (1000 * 60 * 60 * 24));
                    newDate = new Date(delivery.date);
                    newDate.setDate(newDate.getDate() + daysDiff);
                } else {
                    // Replace with specific dates (for this, we'd need more complex logic)
                    // For now, using shift logic
                    const daysDiff = Math.floor((new Date(newStartDate) - new Date(deliveryDates[0])) / (1000 * 60 * 60 * 24));
                    newDate = new Date(delivery.date);
                    newDate.setDate(newDate.getDate() + daysDiff);
                }

                // Check if new date is within 2 months limit
                if (!isWithinRescheduleLimit(delivery.date, newDate)) {
                    errors.push({ date: deliveryDate, error: "New date exceeds 2-month limit" });
                    continue;
                }

                // Check if there's already a delivery on the new date
                const existingDelivery = subscription.deliveries.find(d => {
                    const existingDate = new Date(d.date);
                    return existingDate.toDateString() === newDate.toDateString() && d._id.toString() !== delivery._id.toString();
                });

                if (existingDelivery) {
                    errors.push({ date: deliveryDate, error: "Delivery already exists on new date" });
                    continue;
                }

                // Update the delivery
                const newCutoffTime = calculateCutoffTime(newDate, slot);

                subscription.deliveries[deliveryIndex].date = newDate;
                subscription.deliveries[deliveryIndex].slot = slot.toLowerCase();
                subscription.deliveries[deliveryIndex].cutoffTime = newCutoffTime;
                subscription.deliveries[deliveryIndex].status = 'scheduled';

                results.push({
                    originalDate: deliveryDate,
                    newDate: newDate,
                    success: true
                });

            } catch (error) {
                errors.push({ date: deliveryDate, error: error.message });
            }
        }

        // Sort deliveries by date
        subscription.deliveries.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Update subscription end date based on the last scheduled delivery
        updateSubscriptionEndDate(subscription);

        await subscription.save();

        res.json({
            success: true,
            message: `Rescheduled ${results.length} deliveries successfully`,
            results,
            errors,
            totalProcessed: deliveryDates.length,
            successful: results.length,
            failed: errors.length
        });

    } catch (error) {
        console.error('Error rescheduling multiple deliveries:', error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get upcoming deliveries for calendar view
export const getUpcomingDeliveries = async (req, res) => {
    try {
        const { subscriptionId } = req.params;
        const customerId = req.user._id;

        // Find subscription and verify ownership
        const subscription = await Subscription.findOne({
            _id: subscriptionId,
            customer: customerId
        }).populate('deliveryAddress', 'addressLine1 addressLine2 city state zipCode latitude longitude')
            .populate('deliveryPartner.partner', 'name phone');

        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }

        const now = new Date();
        const upcomingDeliveries = subscription.deliveries
            .filter(delivery => {
                const deliveryDate = new Date(delivery.date);
                return deliveryDate >= now; // Only future deliveries
            })
            .map(delivery => {
                const deliveryDate = new Date(delivery.date);
                const isPastDelivery = deliveryDate < now;
                const pastCutoff = isPastCutoffTime(delivery.cutoffTime, delivery.date);

                return {
                    ...delivery.toObject(),
                    isPastDelivery,
                    pastCutoff,
                    canModify: !isPastDelivery && !pastCutoff,
                    formattedDate: deliveryDate.toISOString().split('T')[0]
                };
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        res.json({
            success: true,
            subscription: {
                subscriptionId: subscription.subscriptionId,
                status: subscription.status,
                slot: subscription.slot
            },
            deliveries: upcomingDeliveries,
            totalUpcoming: upcomingDeliveries.length
        });

    } catch (error) {
        console.error('Error getting upcoming deliveries:', error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get delivery calendar data for a specific month
export const getDeliveryCalendar = async (req, res) => {
    try {
        const { subscriptionId } = req.params;
        const { year, month } = req.query; // Format: 2024, 0-11
        const customerId = req.user._id;

        // Find subscription and verify ownership
        const subscription = await Subscription.findOne({
            _id: subscriptionId,
            customer: customerId
        });

        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }

        const targetYear = parseInt(year) || new Date().getFullYear();
        // Fix: existing `parseInt(month) || ...` treats 0 as false and defaults to current month.
        // We must check if month is provided.
        let targetMonth;
        if (month !== undefined && month !== null) {
            const m = parseInt(month);
            targetMonth = isNaN(m) ? new Date().getMonth() : m;
        } else {
            targetMonth = new Date().getMonth();
        }

        // Filter deliveries for the specific month (UTC) with buffer for timezone differences
        const startBuffer = new Date(Date.UTC(targetYear, targetMonth, -1)); // 2 days before 1st
        const endBuffer = new Date(Date.UTC(targetYear, targetMonth + 1, 2)); // 2 days after end

        const monthDeliveries = subscription.deliveries.filter(d => {
            const date = new Date(d.date);
            return date >= startBuffer && date <= endBuffer;
        });

        // Format for calendar display
        const calendarData = monthDeliveries.map(delivery => {
            const deliveryDate = new Date(delivery.date);
            const now = new Date();
            const isPastDelivery = deliveryDate < now;
            const pastCutoff = isPastCutoffTime(delivery.cutoffTime, delivery.date);

            return {
                date: deliveryDate.toISOString().split('T')[0],
                day: deliveryDate.getDate(),
                slot: delivery.slot,
                status: delivery.status,
                isPastDelivery,
                pastCutoff,
                canModify: !isPastDelivery && !pastCutoff,
                cutoffTime: delivery.cutoffTime,
                products: delivery.products || []
            };
        });

        res.json({
            success: true,
            year: targetYear,
            month: targetMonth,
            deliveries: calendarData,
            subscription: {
                subscriptionId: subscription.subscriptionId,
                status: subscription.status,
                slot: subscription.slot
            }
        });

    } catch (error) {
        console.error('Error getting delivery calendar:', error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Confirm delivery by customer
export const confirmDeliveryByCustomer = async (req, res) => {
    try {
        const { subscriptionId, deliveryDate } = req.params;
        const customerId = req.user._id;

        console.log('🔍 confirmDeliveryByCustomer called with:', {
            subscriptionId,
            deliveryDate,
            customerId
        });

        // Find subscription and verify ownership
        const subscription = await Subscription.findOne({
            _id: subscriptionId,
            customer: customerId
        });

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found or you don't have permission to access it"
            });
        }

        // Find the specific delivery
        const delivery = subscription.deliveries.find(d => {
            const deliveryDateObj = new Date(d.date);
            const targetDateObj = new Date(deliveryDate);
            return deliveryDateObj.toDateString() === targetDateObj.toDateString();
        });

        if (!delivery) {
            return res.status(404).json({
                success: false,
                message: "Delivery not found for the specified date"
            });
        }

        // Check if delivery is in awaitingCustomer status
        if (delivery.status !== 'awaitingCustomer') {
            return res.status(400).json({
                success: false,
                message: `Cannot confirm delivery.Current status is: ${delivery.status}. Only deliveries with 'awaitingCustomer' status can be confirmed.`
            });
        }

        // Update delivery status to delivered
        delivery.status = 'delivered';
        delivery.confirmedAt = new Date();
        delivery.confirmedBy = customerId;

        // Set flag to prevent pre-save hook from overriding manual updates
        subscription._isManualUpdate = true;

        // Debug: Log delivery and subscription product information
        console.log('🔍 Delivery products:', delivery.products);
        console.log('🔍 Delivery productId (legacy):', delivery.productId);
        console.log('🔍 Available subscription products for matching:');
        subscription.products.forEach((p, index) => {
            console.log(`   Product ${index}: `, {
                _id: p._id,
                productId: p.productId,
                productName: p.productName,
                animalType: p.animalType,
                quantityValue: p.quantityValue,
                quantityUnit: p.quantityUnit,
                deliveryFrequency: p.deliveryFrequency,
                deliveredCount: p.deliveredCount,
                totalDeliveries: p.totalDeliveries,
                remainingDeliveries: p.remainingDeliveries
            });
        });

        // Update individual product delivery status within this delivery
        if (delivery.products && delivery.products.length > 0) {
            console.log('📦 Processing multi-product delivery with', delivery.products.length, 'products');
            // Multi-product delivery - update each product's delivery status
            delivery.products.forEach((deliveryProduct, index) => {
                console.log(`🔍 Processing delivery product ${index}: `, {
                    _id: deliveryProduct._id,
                    productId: deliveryProduct.productId,
                    productName: deliveryProduct.productName,
                    animalType: deliveryProduct.animalType,
                    quantityValue: deliveryProduct.quantityValue,
                    quantityUnit: deliveryProduct.quantityUnit,
                    deliveryFrequency: deliveryProduct.deliveryFrequency,
                    subscriptionProductId: deliveryProduct.subscriptionProductId,
                    deliveryStatus: deliveryProduct.deliveryStatus
                });

                deliveryProduct.deliveryStatus = 'delivered';

                // Find corresponding subscription product and update counts
                // Match by subscriptionProductId for exact product identification
                console.log(`🔍 Delivery product details: `, {
                    subscriptionProductId: deliveryProduct.subscriptionProductId,
                    productId: deliveryProduct.productId,
                    productName: deliveryProduct.productName,
                    animalType: deliveryProduct.animalType,
                    quantityValue: deliveryProduct.quantityValue,
                    quantityUnit: deliveryProduct.quantityUnit
                });

                // Primary matching: Use unique subscriptionProductId
                const subscriptionProduct = subscription.products.find(sp =>
                    sp.subscriptionProductId === deliveryProduct.subscriptionProductId
                );

                console.log(`🔍 Found subscription product: `, subscriptionProduct ? {
                    _id: subscriptionProduct._id,
                    productId: subscriptionProduct.productId,
                    productName: subscriptionProduct.productName,
                    animalType: subscriptionProduct.animalType,
                    quantityValue: subscriptionProduct.quantityValue,
                    quantityUnit: subscriptionProduct.quantityUnit,
                    deliveryFrequency: subscriptionProduct.deliveryFrequency,
                    deliveredCount: subscriptionProduct.deliveredCount,
                    totalDeliveries: subscriptionProduct.totalDeliveries,
                    remainingDeliveries: subscriptionProduct.remainingDeliveries
                } : 'NOT FOUND');

                if (subscriptionProduct) {
                    const oldDeliveredCount = subscriptionProduct.deliveredCount;
                    const oldRemainingCount = subscriptionProduct.remainingDeliveries;

                    // Validate before updating counts to prevent negative values
                    if (subscriptionProduct.deliveredCount < subscriptionProduct.totalDeliveries && subscriptionProduct.remainingDeliveries > 0) {
                        subscriptionProduct.deliveredCount += 1;
                        subscriptionProduct.remainingDeliveries = subscriptionProduct.totalDeliveries - subscriptionProduct.deliveredCount;

                        // Additional safety check to ensure remainingDeliveries is not negative
                        if (subscriptionProduct.remainingDeliveries < 0) {
                            subscriptionProduct.remainingDeliveries = 0;
                            console.warn(`⚠️ Corrected negative remainingDeliveries for ${deliveryProduct.productName} to 0`);
                        }

                        console.log(`✅ Updated product ${deliveryProduct.productName}: `);
                        console.log(`   Before: deliveredCount = ${oldDeliveredCount}, remaining = ${oldRemainingCount} `);
                        console.log(`   After: deliveredCount = ${subscriptionProduct.deliveredCount}, remaining = ${subscriptionProduct.remainingDeliveries} `);
                    } else {
                        console.log(`⚠️ Product ${deliveryProduct.productName} already at max deliveries(${subscriptionProduct.deliveredCount} / ${subscriptionProduct.totalDeliveries}) or remainingDeliveries is 0(${subscriptionProduct.remainingDeliveries})`);
                    }
                } else {
                    console.log(`❌ Could not find subscription product for delivery product: `, deliveryProduct.productId);
                }
            });
        } else if (delivery.productId) {
            console.log('📦 Processing legacy single product delivery');
            // Legacy single product delivery - try to match by productId
            // Note: Legacy deliveries don't have subscriptionProductId, so we use productId as fallback
            const subscriptionProduct = delivery.productId ?
                subscription.products.find(sp =>
                    sp.productId.toString() === delivery.productId.toString()
                ) :
                null;

            if (subscriptionProduct) {
                const oldDeliveredCount = subscriptionProduct.deliveredCount;
                const oldRemainingCount = subscriptionProduct.remainingDeliveries;

                if (subscriptionProduct.deliveredCount < subscriptionProduct.totalDeliveries) {
                    subscriptionProduct.deliveredCount += 1;
                    subscriptionProduct.remainingDeliveries = subscriptionProduct.totalDeliveries - subscriptionProduct.deliveredCount;

                    console.log(`✅ Updated legacy product: `);
                    console.log(`   Before: deliveredCount = ${oldDeliveredCount}, remaining = ${oldRemainingCount} `);
                    console.log(`   After: deliveredCount = ${subscriptionProduct.deliveredCount}, remaining = ${subscriptionProduct.remainingDeliveries} `);
                } else {
                    console.log(`⚠️ Legacy product already at max deliveries(${subscriptionProduct.deliveredCount} / ${subscriptionProduct.totalDeliveries})`);
                }
            } else {
                console.log(`❌ Could not find subscription product for legacy delivery product: `, delivery.productId);
            }
        } else {
            // Fallback: update all products (for backward compatibility)
            console.log('⚠️ No specific products found in delivery, updating all subscription products');
            subscription.products.forEach((product, index) => {
                const oldDeliveredCount = product.deliveredCount;
                const oldRemainingCount = product.remainingDeliveries;

                if (product.deliveredCount < product.totalDeliveries) {
                    product.deliveredCount += 1;
                    product.remainingDeliveries = product.totalDeliveries - product.deliveredCount;

                    console.log(`✅ Updated fallback product ${index}: `);
                    console.log(`   Before: deliveredCount = ${oldDeliveredCount}, remaining = ${oldRemainingCount} `);
                    console.log(`   After: deliveredCount = ${product.deliveredCount}, remaining = ${product.remainingDeliveries} `);
                } else {
                    console.log(`⚠️ Fallback product ${index} already at max deliveries(${product.deliveredCount} / ${product.totalDeliveries})`);
                }
            });
        }

        // Save the subscription
        await subscription.save();

        // Clear the manual update flag
        subscription._isManualUpdate = false;

        // Debug: Log final product counts after save
        console.log('🔍 Final product counts after save:');
        subscription.products.forEach((product, index) => {
            console.log(`   Product ${index}: ${product.productName} - deliveredCount=${product.deliveredCount}, remaining = ${product.remainingDeliveries} `);
        });

        console.log('✅ Delivery confirmed successfully:', {
            subscriptionId,
            deliveryDate,
            newStatus: delivery.status,
            confirmedAt: delivery.confirmedAt
        });

        // Calculate overall subscription status
        const totalRemainingDeliveries = subscription.products.reduce((sum, p) => sum + p.remainingDeliveries, 0);
        const isSubscriptionCompleted = totalRemainingDeliveries === 0;

        return res.status(200).json({
            success: true,
            message: "Delivery confirmed successfully",
            data: {
                subscriptionId,
                deliveryDate,
                status: delivery.status,
                confirmedAt: delivery.confirmedAt,
                isSubscriptionCompleted,
                totalRemainingDeliveries,
                products: subscription.products.map(p => ({
                    productId: p.productId,
                    productName: p.productName,
                    totalDeliveries: p.totalDeliveries,
                    deliveredCount: p.deliveredCount,
                    remainingDeliveries: p.remainingDeliveries,
                    deliveryFrequency: p.deliveryFrequency
                })),
                deliveryProducts: delivery.products ? delivery.products.map(dp => ({
                    productId: dp.productId,
                    productName: dp.productName,
                    quantityValue: dp.quantityValue,
                    quantityUnit: dp.quantityUnit,
                    deliveryStatus: dp.deliveryStatus
                })) : []
            }
        });

    } catch (error) {
        console.error('❌ Error confirming delivery:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to confirm delivery",
            error: error.message
        });
    }
};
