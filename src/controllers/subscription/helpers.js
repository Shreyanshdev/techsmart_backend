import Branch from '../../models/branch.js';
import Subscription from '../../models/subscription.js';

// ==================== DISTANCE & LOCATION HELPERS ====================

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}

/**
 * Get nearest branch based on customer location
 */
export const getNearestBranch = async (req, res) => {
    try {
        const { latitude, longitude } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({ message: "Latitude and longitude are required" });
        }

        const branches = await Branch.find({});

        if (branches.length === 0) {
            return res.status(404).json({ message: "No branches found" });
        }

        // Calculate distance to each branch and find nearest
        let nearestBranch = null;
        let minDistance = Infinity;

        branches.forEach(branch => {
            const distance = calculateDistance(
                parseFloat(latitude),
                parseFloat(longitude),
                branch.location.latitude,
                branch.location.longitude
            );

            if (distance < minDistance) {
                minDistance = distance;
                nearestBranch = branch;
            }
        });

        return res.status(200).json({
            message: "Nearest branch found",
            branch: nearestBranch,
            distance: minDistance
        });
    } catch (error) {
        console.error("Get nearest branch error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// ==================== DATE & TIME HELPERS ====================

/**
 * Update subscription end date based on last scheduled delivery
 * @param {Object} subscription - Mongoose subscription document
 */
export const updateSubscriptionEndDate = (subscription) => {
    const lastScheduledDelivery = subscription.deliveries
        .filter(d => d.status === 'scheduled')
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

    if (lastScheduledDelivery) {
        const lastDeliveryDate = new Date(lastScheduledDelivery.date);
        subscription.endDate = lastDeliveryDate;
        console.log(`📅 Updated subscription end date to: ${lastDeliveryDate.toISOString()}`);
    }
};

/**
 * Check if current time is past cutoff time (only for today's deliveries)
 * @param {Date} cutoffTime - Cutoff time for the delivery
 * @param {Date} deliveryDate - Date of the delivery
 * @returns {boolean} True if past cutoff time
 */
export const isPastCutoffTime = (cutoffTime, deliveryDate) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const deliveryDay = new Date(deliveryDate);
    deliveryDay.setHours(0, 0, 0, 0);

    // Only check cutoff time for today's deliveries
    if (deliveryDay.getTime() === today.getTime()) {
        return now > new Date(cutoffTime);
    }

    // For future deliveries, no cutoff time restriction
    return false;
};

/**
 * Check if date is within 2 months from delivery date
 * @param {Date} deliveryDate - Original delivery date
 * @param {Date} newDate - New proposed date
 * @returns {boolean} True if within limit
 */
export const isWithinRescheduleLimit = (deliveryDate, newDate) => {
    const twoMonthsFromDelivery = new Date(deliveryDate);
    twoMonthsFromDelivery.setMonth(twoMonthsFromDelivery.getMonth() + 2);

    const newDeliveryDate = new Date(newDate);
    return newDeliveryDate <= twoMonthsFromDelivery && newDeliveryDate >= new Date();
};

/**
 * Calculate cutoff time for a given date and slot
 * @param {Date} date - Delivery date
 * @param {string} slot - Delivery slot ('morning' or 'evening')
 * @returns {Date} Cutoff time
 */
export const calculateCutoffTime = (date, slot) => {
    const cutoffTime = new Date(date);
    if (slot.toLowerCase() === 'morning') {
        // Morning slot: 6 AM, cutoff at 4 AM
        cutoffTime.setHours(4, 0, 0, 0);
    } else {
        // Evening slot: 6 PM, cutoff at 4 PM
        cutoffTime.setHours(16, 0, 0, 0);
    }
    return cutoffTime;
};

// ==================== DELIVERY SCHEDULE HELPERS ====================

/**
 * Generate optimized delivery schedule for multi-product subscriptions
 * @param {Array} products - Array of subscription products
 * @param {Date} startDate - Subscription start date
 * @param {Date} endDate - Subscription end date
 * @param {string} slot - Delivery slot
 * @returns {Object} Delivery schedule with deliveries array and total count
 */
export function generateMultiProductDeliverySchedule(products, startDate, endDate, slot) {
    console.log('🔍 Generating multi-product delivery schedule...');
    console.log('🔍 Products:', products.map(p => ({ name: p.productName, frequency: p.deliveryFrequency })));

    const deliveryMap = new Map(); // date -> delivery object

    // Generate delivery dates for each product based on their frequency
    products.forEach(product => {
        const productStartDate = new Date(startDate);
        const productEndDate = new Date(endDate);
        let currentDate = new Date(productStartDate);

        console.log(`🔍 Processing product ${product.productName} with frequency ${product.deliveryFrequency}`);

        while (currentDate <= productEndDate) {
            const dateKey = currentDate.toDateString();

            // Check if delivery already exists for this date
            if (deliveryMap.has(dateKey)) {
                // Add product to existing delivery
                const existingDelivery = deliveryMap.get(dateKey);
                const productToAdd = {
                    subscriptionProductId: product.subscriptionProductId,
                    productId: product.productId,
                    productName: product.productName,
                    quantityValue: product.quantityValue,
                    quantityUnit: product.quantityUnit,
                    unitPrice: product.unitPrice,
                    animalType: product.animalType || 'cow',
                    deliveryFrequency: product.deliveryFrequency,
                    deliveryStatus: 'pending'
                };

                existingDelivery.products.push(productToAdd);
                console.log(`🔍 Added ${product.productName} to existing delivery on ${dateKey}`);
            } else {
                // Create new delivery for this date
                const productForNewDelivery = {
                    subscriptionProductId: product.subscriptionProductId,
                    productId: product.productId,
                    productName: product.productName,
                    quantityValue: product.quantityValue,
                    quantityUnit: product.quantityUnit,
                    unitPrice: product.unitPrice,
                    animalType: product.animalType || 'cow',
                    deliveryFrequency: product.deliveryFrequency,
                    deliveryStatus: 'pending'
                };

                // Calculate cutoff time for this specific delivery date
                const deliveryCutoffTime = calculateCutoffTime(currentDate, slot);

                const newDelivery = {
                    date: new Date(currentDate),
                    slot: slot,
                    status: 'scheduled',
                    cutoffTime: deliveryCutoffTime,
                    products: [productForNewDelivery],
                    isCustom: false
                };
                deliveryMap.set(dateKey, newDelivery);
                console.log(`🔍 Created new delivery for ${product.productName} on ${dateKey}`);
            }

            // Move to next delivery date based on frequency
            switch (product.deliveryFrequency) {
                case 'daily':
                    currentDate.setDate(currentDate.getDate() + 1);
                    break;
                case 'alternate':
                    currentDate.setDate(currentDate.getDate() + 2);
                    break;
                case 'weekly':
                    currentDate.setDate(currentDate.getDate() + 7);
                    break;
                case 'monthly':
                    currentDate.setDate(currentDate.getDate() + 30);
                    break;
                default:
                    currentDate.setDate(currentDate.getDate() + 1);
            }
        }
    });

    // Convert map to array and sort by date
    const deliveries = Array.from(deliveryMap.values()).sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    console.log(`🔍 Generated ${deliveries.length} delivery dates with multi-product support`);

    return {
        deliveries,
        totalDeliveries: deliveries.length
    };
}

// ==================== VALIDATION HELPERS ====================

/**
 * Validate and fix delivery counts for a subscription
 */
export const validateDeliveryCounts = async (req, res) => {
    try {
        const { subscriptionId } = req.params;

        const subscription = await Subscription.findById(subscriptionId);
        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }

        // Count actual deliveries
        const actualDeliveredCount = subscription.deliveries.filter(d => d.status === "delivered").length;
        const actualScheduledCount = subscription.deliveries.filter(d => d.status === "scheduled").length;
        const actualPausedCount = subscription.deliveries.filter(d => d.status === "paused").length;

        // Calculate correct totals
        const totalDeliveries = subscription.deliveries.length;
        const remainingDeliveries = actualScheduledCount + actualPausedCount;

        // Update if counts are wrong
        let updated = false;
        if (subscription.deliveredCount !== actualDeliveredCount) {
            subscription.deliveredCount = actualDeliveredCount;
            updated = true;
        }
        if (subscription.totalDeliveries !== totalDeliveries) {
            subscription.totalDeliveries = totalDeliveries;
            updated = true;
        }
        if (subscription.remainingDeliveries !== remainingDeliveries) {
            subscription.remainingDeliveries = remainingDeliveries;
            updated = true;
        }

        if (updated) {
            await subscription.save();
            return res.status(200).json({
                message: "Delivery counts validated and fixed",
                counts: {
                    delivered: subscription.deliveredCount,
                    total: subscription.totalDeliveries,
                    remaining: subscription.remainingDeliveries
                }
            });
        } else {
            return res.status(200).json({
                message: "Delivery counts are already correct",
                counts: {
                    delivered: subscription.deliveredCount,
                    total: subscription.totalDeliveries,
                    remaining: subscription.remainingDeliveries
                }
            });
        }
    } catch (error) {
        console.error("Validate delivery counts error:", error);
        return res.status(400).json({ message: error.message });
    }
};
