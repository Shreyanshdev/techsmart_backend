import mongoose from "mongoose";
import Counter from "./counter.js";

const deliverySchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    slot: {
        type: String,
        enum: ["morning", "evening"],
        required: true
    },
    status: {
        type: String,
        enum: ["scheduled", "reaching", "awaitingCustomer", "delivered", "paused", "canceled", "noResponse", "concession"],
        default: "scheduled"
    },
    // When delivery partner starts delivery (changes to reaching)
    startedAt: {
        type: Date
    },
    // When delivery partner marks as delivered
    deliveredAt: {
        type: Date
    },
    // When customer confirms delivery
    confirmedAt: {
        type: Date
    },
    // Auto-cancellation and concession
    canceledAt: {
        type: Date
    },
    concession: {
        type: Boolean,
        default: false
    },
    // Concession details - when a missed delivery is rescheduled as compensation
    concessionDetails: {
        originalDate: { type: Date },           // Original missed delivery date
        rescheduledTo: { type: Date },          // New date the delivery was moved to
        reason: { type: String, default: "Missed by delivery partner" },
        extendedSubscription: { type: Boolean, default: false }, // If subscription was extended
        processedAt: { type: Date },            // When concession was processed
    },
    // Cutoff time for this specific delivery (2 hours before slot)
    cutoffTime: {
        type: Date,
        required: true
    },
    // Live location tracking when status is 'reaching'
    liveLocation: {
        latitude: { type: Number },
        longitude: { type: Number },
        address: { type: String },
        lastUpdated: { type: Date }
    },
    // Enhanced: Array of products for this delivery (for same-day multi-product deliveries)
    products: [{
        subscriptionProductId: {
            type: String,
            required: true
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        productName: {
            type: String,
            required: true
        },
        quantityValue: { type: Number, required: true },
        quantityUnit: { type: String, required: true },
        unitPrice: {
            type: Number,
            required: true
        },
        animalType: {
            type: String,
            required: true
        },
        // Individual product delivery status within this delivery
        deliveryStatus: {
            type: String,
            enum: ["pending", "delivered", "failed"],
            default: "pending"
        }
    }],
    // Legacy: Single product support (for backward compatibility)
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    // Custom delivery flag
    isCustom: {
        type: Boolean,
        default: false
    }
});

// Enhanced product schema for multi-product subscriptions
const subscriptionProductSchema = new mongoose.Schema({
    subscriptionProductId: {
        type: String,
        unique: true,
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    quantityValue: { type: Number, required: true },
    quantityUnit: { type: String, required: true },
    unitPrice: {
        type: Number,
        required: true
    },
    monthlyPrice: {
        type: Number,
        required: true
    },
    deliveryFrequency: {
        type: String,
        enum: ["daily", "alternate", "weekly", "monthly"],
        required: true
    },
    deliveryGap: {
        type: Number, // days between deliveries
        required: true
    },
    maxDeliveries: {
        type: Number,
        required: true
    },
    // Individual product delivery tracking
    totalDeliveries: {
        type: Number,
        required: true
    },
    deliveredCount: {
        type: Number,
        default: 0
    },
    remainingDeliveries: {
        type: Number,
        required: true
    },
    // Count field for same product with same configuration (animal, quantity, frequency)
    count: {
        type: Number,
        default: 1,
        required: true
    }
});

const subscriptionSchema = new mongoose.Schema({
    subscriptionId: {
        type: String,
        unique: true,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    },
    // Enhanced products array for multi-product support
    products: [subscriptionProductSchema],
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
        required: true, // Make branch required
    },
    slot: {
        type: String,
        enum: ["morning", "evening"],
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    deliveryAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true,
    },
    deliveryPartner: {
        partner: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryPartner" },
        phone: { type: String },
        name: { type: String },
        currentLocation: {
            latitude: { type: Number, default: 0 },
            longitude: { type: Number, default: 0 },
            address: { type: String, default: "Location not available" }
        },
        assignedDate: { type: Date },
        isActive: { type: Boolean, default: true }
    },
    // Global delivery schedule (for overall subscription management)
    deliveries: [deliverySchema],
    // Enhanced pricing
    price: {
        type: Number,
        required: true,
    },
    bill: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "pending", "cancelled", "expired"],
        default: "pending",
    },
    // Enhanced payment tracking fields
    paymentStatus: {
        type: String,
        enum: ["pending", "verified", "failed", "refunded"],
        default: "pending",
    },
    paymentDetails: {
        razorpayOrderId: { type: String },
        razorpayPaymentId: { type: String },
        razorpaySignature: { type: String },
        verifiedAt: { type: Date },
        amount: { type: Number },
        currency: { type: String, default: "INR" },
        method: { type: String }, // card, upi, netbanking, etc.
        paymentMethod: { type: String, enum: ['online', 'cod'], default: 'online' }, // COD or online payment
        refundId: { type: String },
        refundedAt: { type: Date },
        refundAmount: { type: Number },
        refundReason: { type: String }
    },
    // Payment history for products added after initial subscription
    productPaymentHistory: [{
        subscriptionProductId: { type: String, required: true },
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        productName: { type: String, required: true },
        quantityValue: { type: Number, required: true },
        quantityUnit: { type: String, required: true },
        amount: { type: Number, required: true },
        currency: { type: String, default: "INR" },
        paymentMethod: { type: String, enum: ['online', 'cod'], default: 'online' }, // Track payment method
        razorpayOrderId: { type: String, required: false }, // Optional for COD
        razorpayPaymentId: { type: String, required: false }, // Optional for COD
        razorpaySignature: { type: String },
        verifiedAt: { type: Date }, // Optional - null for COD pending
        status: {
            type: String,
            enum: ["pending", "verified", "cod", "refunded", "failed"], // Added pending and cod for COD payments
            default: "verified"
        },
        createdAt: { type: Date, default: Date.now }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});



async function generateSubscriptionId() {
    try {
        const counter = await Counter.findOneAndUpdate(
            { name: "subscriptionId" },
            { $inc: { sequenceValue: 1 } },
            { new: true, upsert: true }
        );
        const subscriptionId = `SUB-${counter.sequenceValue.toString().padStart(5, '0')}`;
        console.log('Generated subscriptionId:', subscriptionId);
        return subscriptionId;
    } catch (error) {
        console.error('Error generating subscriptionId:', error);
        throw new Error('Failed to generate subscription ID');
    }
}

async function generateSubscriptionProductId() {
    try {
        const counter = await Counter.findOneAndUpdate(
            { name: "subscriptionProductId" },
            { $inc: { sequenceValue: 1 } },
            { new: true, upsert: true }
        );
        const subscriptionProductId = `SP-${counter.sequenceValue.toString().padStart(6, '0')}`;
        console.log('Generated subscriptionProductId:', subscriptionProductId);
        return subscriptionProductId;
    } catch (error) {
        console.error('Error generating subscriptionProductId:', error);
        throw new Error('Failed to generate subscription product ID');
    }
}

// Function to generate delivery schedule with cutoff times
function generateDeliverySchedule(startDate, totalDays = 30, defaultSlot) {
    const deliveries = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < totalDays; i++) {
        const deliveryDate = new Date(currentDate);
        deliveryDate.setDate(currentDate.getDate() + i);

        // Calculate cutoff time (2 hours before delivery slot)
        const cutoffTime = new Date(deliveryDate);
        if (defaultSlot.toLowerCase() === 'morning') {
            // Morning slot: 6 AM, cutoff at 4 AM
            cutoffTime.setHours(4, 0, 0, 0);
        } else {
            // Evening slot: 6 PM, cutoff at 4 PM
            cutoffTime.setHours(16, 0, 0, 0);
        }

        deliveries.push({
            date: deliveryDate,
            slot: defaultSlot.toLowerCase(), // "morning" or "evening"
            status: "scheduled",
            cutoffTime: cutoffTime
        });
    }

    return deliveries;
}

// Safe method to update delivery counts with validation
subscriptionSchema.methods.safeUpdateDeliveryCounts = function (subscriptionProductId, increment = 1) {
    const product = this.products.find(p => p.subscriptionProductId === subscriptionProductId);

    if (!product) {
        throw new Error(`Product with subscriptionProductId ${subscriptionProductId} not found`);
    }

    // Validate before updating
    if (increment > 0) {
        // Incrementing deliveredCount
        if (product.deliveredCount + increment <= product.totalDeliveries) {
            product.deliveredCount += increment;
            product.remainingDeliveries = product.totalDeliveries - product.deliveredCount;
            console.log(`✅ Safely updated delivery counts for ${product.productName}: deliveredCount=${product.deliveredCount}, remaining=${product.remainingDeliveries}`);
        } else {
            console.warn(`⚠️ Cannot increment deliveredCount for ${product.productName}: would exceed totalDeliveries (${product.deliveredCount + increment}/${product.totalDeliveries})`);
        }
    } else if (increment < 0) {
        // Decrementing deliveredCount
        if (product.deliveredCount + increment >= 0) {
            product.deliveredCount += increment;
            product.remainingDeliveries = product.totalDeliveries - product.deliveredCount;
            console.log(`✅ Safely decremented delivery counts for ${product.productName}: deliveredCount=${product.deliveredCount}, remaining=${product.remainingDeliveries}`);
        } else {
            console.warn(`⚠️ Cannot decrement deliveredCount for ${product.productName}: would go below 0 (${product.deliveredCount + increment})`);
        }
    }

    return product;
};

// Auto-cancellation method for 11 PM rule
subscriptionSchema.methods.autoCancelExpiredDeliveries = async function () {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const elevenPM = new Date(today);
    elevenPM.setHours(23, 0, 0, 0);

    // Only run auto-cancellation after 11 PM
    if (now >= elevenPM) {
        let hasChanges = false;

        this.deliveries.forEach(delivery => {
            const deliveryDate = new Date(delivery.date);
            deliveryDate.setHours(0, 0, 0, 0);

            // Auto-cancel today's deliveries that are still scheduled or awaitingCustomer
            if (deliveryDate.getTime() === today.getTime() &&
                ['scheduled', 'awaitingCustomer'].includes(delivery.status) &&
                !delivery.concession) {

                console.log(`Auto-canceling delivery for ${delivery.date.toDateString()} at 11 PM`);

                delivery.status = 'canceled';
                delivery.canceledAt = new Date();
                delivery.concession = true; // Give concession for auto-cancellation

                hasChanges = true;
            }
        });

        if (hasChanges) {
            console.log('Auto-cancellation applied - deliveries marked as canceled with concession');
            // Note: We don't reduce remainingDeliveries count for canceled deliveries with concession
        }
    }
};

subscriptionSchema.pre("save", async function (next) {
    try {
        if (this.isNew) {
            this.subscriptionId = await generateSubscriptionId();
            console.log('Generated subscriptionId:', this.subscriptionId);

            // Only generate delivery schedule if deliveries are not already set (for backward compatibility)
            if (!this.deliveries || this.deliveries.length === 0) {
                console.log('🔍 No deliveries found, generating basic delivery schedule');
                this.deliveries = generateDeliverySchedule(this.startDate, this.totalDeliveries, this.slot);
                this.remainingDeliveries = this.totalDeliveries;
            } else {
                console.log('🔍 Deliveries already set, skipping basic delivery schedule generation');
                console.log('🔍 Existing deliveries count:', this.deliveries.length);
                console.log('🔍 First delivery products:', this.deliveries[0]?.products?.length || 0);
            }
        }

        // Auto-scheduling logic when delivery partner is assigned
        if (this.isModified('deliveryPartner') && this.deliveryPartner && this.deliveryPartner.partner) {
            console.log('Delivery partner assigned, auto-scheduling deliveries');

            // Update all scheduled deliveries with the assigned partner
            this.deliveries.forEach(delivery => {
                if (delivery.status === 'scheduled' && !delivery.deliveryPartnerId) {
                    delivery.deliveryPartnerId = this.deliveryPartner.partner;
                    console.log(`Assigned delivery partner ${this.deliveryPartner.partner} to delivery on ${delivery.date.toDateString()}`);
                }
            });
        }

        // Auto-cancellation logic for 11 PM rule
        await this.autoCancelExpiredDeliveries();

        // Auto-cancellation and concession logic for expired deliveries
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        this.deliveries.forEach(delivery => {
            const deliveryDate = new Date(delivery.date);
            const deliveryDay = new Date(deliveryDate.getFullYear(), deliveryDate.getMonth(), deliveryDate.getDate());

            // If today's scheduled delivery didn't reach customer, auto-cancel and give concession
            if (deliveryDay.getTime() === today.getTime() && delivery.status === 'scheduled' && !delivery.concession) {
                console.log(`Auto-cancelling today's undelivered delivery for ${deliveryDate.toDateString()}`);
                delivery.status = 'canceled';
                delivery.canceledAt = new Date();
                delivery.concession = true;

                // Schedule replacement delivery at the end
                const newDeliveryDate = new Date(this.endDate);
                newDeliveryDate.setDate(newDeliveryDate.getDate() + 1);

                // Calculate cutoff time for new delivery
                const cutoffTime = new Date(newDeliveryDate);
                if (this.slot.toLowerCase() === 'morning') {
                    cutoffTime.setHours(4, 0, 0, 0);
                } else {
                    cutoffTime.setHours(16, 0, 0, 0);
                }

                this.deliveries.push({
                    date: newDeliveryDate,
                    slot: this.slot.toLowerCase(),
                    status: 'scheduled',
                    concession: true,
                    cutoffTime: cutoffTime,
                    deliveryPartnerId: delivery.deliveryPartnerId // Keep same delivery partner if assigned
                });

                // Extend subscription by 1 day and update counts
                this.endDate = newDeliveryDate;
                this.totalDeliveries += 1;
                this.remainingDeliveries += 1;

                console.log(`Added concession delivery for ${newDeliveryDate.toDateString()}, extended end date to ${this.endDate.toDateString()}`);
            }
        });

        // Update remaining deliveries count for each product
        this.products.forEach(product => {
            let deliveredCount = 0;

            // Count deliveries for this product using the new multi-product structure
            this.deliveries.forEach(delivery => {
                if (delivery.products && delivery.products.length > 0) {
                    // Multi-product delivery structure - match by unique subscriptionProductId
                    const deliveryProduct = delivery.products.find(dp =>
                        dp.subscriptionProductId === product.subscriptionProductId
                    );
                    if (deliveryProduct && deliveryProduct.deliveryStatus === 'delivered') {
                        deliveredCount++;
                    }
                } else if (delivery.productId && delivery.productId.toString() === product.productId.toString()) {
                    // Legacy single product delivery structure (fallback for old deliveries)
                    if (delivery.status === "delivered") {
                        deliveredCount++;
                    }
                }
            });

            // Only update if we're not in the middle of a manual update (to avoid overriding manual updates)
            if (!this._isManualUpdate) {
                product.deliveredCount = deliveredCount;
                product.remainingDeliveries = product.totalDeliveries - product.deliveredCount;

                // Additional validation to prevent negative values
                if (product.remainingDeliveries < 0) {
                    console.warn(`⚠️ Corrected negative remainingDeliveries for product ${product.productName} from ${product.remainingDeliveries} to 0`);
                    product.remainingDeliveries = 0;
                }

                // Ensure deliveredCount doesn't exceed totalDeliveries
                if (product.deliveredCount > product.totalDeliveries) {
                    console.warn(`⚠️ Corrected deliveredCount for product ${product.productName} from ${product.deliveredCount} to ${product.totalDeliveries}`);
                    product.deliveredCount = product.totalDeliveries;
                    product.remainingDeliveries = 0;
                }
            }
        });

        // Check if subscription should be completed, expired, or expiring
        // Check if subscription should be completed, expired, or expiring
        if (this.remainingDeliveries <= 0) {
            this.status = "completed";
        } else if (this.status !== 'pending' && this.status !== 'cancelled') {
            const now = new Date();
            const daysToExpiry = Math.ceil((this.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

            if (daysToExpiry <= 0) {
                this.status = "expired";
            } else if (daysToExpiry <= 3) {
                this.status = "expiring";
            } else {
                this.status = "active";
            }
        }

        // Update timestamps    
        this.updatedAt = Date.now();
        next();
    } catch (error) {
        console.error('Error in pre-save hook:', error);
        next(error);
    }
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export { generateSubscriptionProductId };
export default Subscription;