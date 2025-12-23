import razorpay from '../config/razorpay.js';
import crypto from 'crypto';
import Order from '../models/order.js'; // Import the Order model
import Subscription from '../models/subscription.js'; // Import the Subscription model
import mongoose from 'mongoose';
import {
    validatePositiveNumber,
    validateNonEmptyString,
    validateEnum
} from '../utils/validators.js';

// Enhanced payment order creation with validation
export const createOrder = async (req, res) => {
    const { amount, currency, receipt, orderType, orderId } = req.body;

    let numericAmount;

    // ===== INPUT VALIDATION =====
    try {
        // Validate required fields
        if (!amount || !currency || !receipt) {
            throw new Error("Missing required fields: amount, currency, receipt");
        }

        // Validate amount using centralized validator
        numericAmount = validatePositiveNumber(amount, 'Amount');

        // Validate currency
        validateEnum(currency, ['INR'], 'Currency');

        // Validate receipt
        validateNonEmptyString(receipt, 'Receipt');

        // Validate receipt format (alphanumeric and underscores only)
        if (!/^[a-zA-Z0-9_-]+$/.test(receipt)) {
            throw new Error('Receipt must contain only alphanumeric characters, hyphens, and underscores');
        }

    } catch (validationError) {
        return res.status(400).json({
            success: false,
            error: validationError.message
        });
    }
    // ===== END VALIDATION =====

    try {
        // If orderId is provided, validate the order exists and is in correct state
        if (orderId) {
            if (!mongoose.Types.ObjectId.isValid(orderId)) {
                return res.status(400).json({
                    success: false,
                    error: "Invalid order ID format"
                });
            }

            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({
                    success: false,
                    error: "Order not found"
                });
            }

            // SECURITY: Verify order belongs to authenticated user
            const userId = req.user._id || req.user.userId;
            if (order.customer.toString() !== userId.toString()) {
                return res.status(403).json({
                    success: false,
                    error: "You are not authorized to pay for this order"
                });
            }

            // Check if order is in a state that allows payment
            if (!['pending', 'created'].includes(order.status)) {
                return res.status(400).json({
                    success: false,
                    error: `Order cannot be paid. Current status: ${order.status}`
                });
            }

            // Validate amount matches order total (totalPrice already includes deliveryFee)
            const expectedAmount = order.totalPrice;
            if (Math.abs(numericAmount - expectedAmount) > 0.01) { // Allow small floating point differences
                return res.status(400).json({
                    success: false,
                    error: `Amount mismatch. Expected: ${expectedAmount}, Received: ${numericAmount}`
                });
            }
        }

        // Special handling for addProduct order type (no existing order validation needed)
        if (orderType === 'addProduct') {
            console.log('✅ Creating Razorpay order for add product payment:', {
                amount: numericAmount,
                currency,
                receipt,
                orderType
            });
            // No additional validation needed for add product payments
        }

        const options = {
            amount: Math.round(numericAmount * 100), // To paise
            currency: currency,
            receipt: receipt,
            notes: {
                orderId: orderId || null,
                orderType: orderType || 'regular',
                timestamp: new Date().toISOString()
            }
        };

        const order = await razorpay.orders.create(options);
        console.log("✅ Razorpay order created successfully:", {
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            status: order.status
        });

        res.json({
            success: true,
            ...order
        });
    } catch (error) {
        console.error("Razorpay order creation failed:", error);
        res.status(500).json({
            success: false,
            error: error?.message || "Failed to create Razorpay order"
        });
    }
};

// Enhanced payment verification with comprehensive validation
export const verifyPayment = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const { order_id, payment_id, signature, appOrderId, subscriptionId, amount, isAddProductPayment } = req.body;

        // Enhanced validation
        if (!order_id || !payment_id || !signature) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields for verification"
            });
        }

        // Validate signature format
        if (typeof signature !== 'string' || signature.length !== 64) {
            return res.status(400).json({
                success: false,
                error: "Invalid signature format"
            });
        }

        // Verify Razorpay signature
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(`${order_id}|${payment_id}`);
        const generated_signature = hmac.digest('hex');

        if (generated_signature !== signature) {
            console.error("Payment verification failed - invalid signature");
            return res.status(400).json({
                success: false,
                error: "Payment verification failed - invalid signature"
            });
        }

        // Start transaction for atomic operations
        await session.startTransaction();

        // SECURITY: Verify ownership before processing
        const userId = req.user._id || req.user.userId;

        // Process order payment
        if (appOrderId) {
            // Verify order belongs to authenticated user
            const order = await Order.findById(appOrderId);
            if (order && order.customer.toString() !== userId.toString()) {
                await session.abortTransaction();
                return res.status(403).json({
                    success: false,
                    error: "Unauthorized payment verification"
                });
            }

            const orderResult = await processOrderPayment(appOrderId, {
                order_id,
                payment_id,
                signature,
                amount
            }, session);

            if (!orderResult.success) {
                await session.abortTransaction();
                return res.status(400).json({
                    success: false,
                    error: orderResult.error
                });
            }
        }

        // Handle addProduct payments (no specific processing needed, just verification)
        if (subscriptionId && isAddProductPayment) {
            console.log('✅ Processing addProduct payment verification:', { order_id, payment_id, subscriptionId });
            // For addProduct payments, we just need to verify the payment
            // The actual product addition happens in the frontend after verification
            // No need to call processSubscriptionPayment for add-product payments
        } else if (subscriptionId && !appOrderId) {
            // Verify subscription belongs to authenticated user
            const subscription = await Subscription.findById(subscriptionId);
            if (subscription && subscription.customer.toString() !== userId.toString()) {
                await session.abortTransaction();
                return res.status(403).json({
                    success: false,
                    error: "Unauthorized payment verification"
                });
            }

            // This is a subscription creation payment - process it normally
            const subscriptionResult = await processSubscriptionPayment(subscriptionId, {
                order_id,
                payment_id,
                signature,
                amount
            }, session);

            if (!subscriptionResult.success) {
                await session.abortTransaction();
                return res.status(400).json({
                    success: false,
                    error: subscriptionResult.error
                });
            }
        }

        // Commit transaction
        await session.commitTransaction();

        res.json({
            success: true,
            message: "Payment verified successfully",
            order_id,
            payment_id,
            appOrderId: appOrderId || null,
            subscriptionId: subscriptionId || null
        });

    } catch (error) {
        // Abort transaction on error
        await session.abortTransaction();
        console.error("Payment verification error:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error during payment verification"
        });
    } finally {
        // End session
        await session.endSession();
    }
};

// Get payment status for an order
export const getPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid order ID format"
            });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                error: "Order not found"
            });
        }

        res.json({
            success: true,
            orderId: order._id,
            status: order.status,
            paymentStatus: order.paymentStatus || 'pending',
            paymentDetails: order.paymentDetails || null,
            totalAmount: order.totalPrice
        });

    } catch (error) {
        console.error("Get payment status error:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Refund payment (admin functionality)
export const refundPayment = async (req, res) => {
    try {
        const { paymentId, amount, reason } = req.body;

        if (!paymentId) {
            return res.status(400).json({
                success: false,
                error: "Payment ID is required"
            });
        }

        const refundData = {
            payment_id: paymentId,
            amount: amount ? Math.round(Number(amount) * 100) : undefined, // Convert to paise
            notes: {
                reason: reason || 'Customer request',
                refundedAt: new Date().toISOString()
            }
        };

        const refund = await razorpay.payments.refund(paymentId, refundData);
        console.log("Refund processed:", refund);

        res.json({
            success: true,
            message: "Refund processed successfully",
            refund
        });

    } catch (error) {
        console.error("Refund error:", error);
        res.status(500).json({
            success: false,
            error: error?.message || "Failed to process refund"
        });
    }
};

// Process order payment with validation
async function processOrderPayment(orderId, paymentData, session) {
    try {
        const { order_id, payment_id, signature, amount } = paymentData;

        // Validate order ID format
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return { success: false, error: "Invalid order ID format" };
        }

        // Find order with session for transaction
        const order = await Order.findById(orderId).session(session);
        if (!order) {
            return { success: false, error: "Order not found" };
        }

        // Check if order is in a state that allows payment verification
        if (!['pending', 'created'].includes(order.status)) {
            return { success: false, error: `Order cannot be verified. Current status: ${order.status}` };
        }

        // Validate amount if provided (totalPrice already includes deliveryFee)
        if (amount) {
            const expectedAmount = order.totalPrice;
            const receivedAmount = Number(amount);
            if (Math.abs(receivedAmount - expectedAmount) > 0.01) {
                return { success: false, error: `Amount mismatch. Expected: ${expectedAmount}, Received: ${receivedAmount}` };
            }
        }

        // Check for duplicate payment processing
        if (order.paymentStatus === 'verified' || order.paymentStatus === 'completed') {
            return { success: false, error: "Payment already processed for this order" };
        }

        // Update order with payment information
        order.paymentStatus = 'verified';
        order.paymentDetails = {
            razorpayOrderId: order_id,
            razorpayPaymentId: payment_id,
            razorpaySignature: signature,
            verifiedAt: new Date(),
            amount: amount || order.totalPrice
        };
        order.updatedAt = new Date();

        await order.save({ session });
        console.log(`Order ${orderId} payment verified and status updated to accepted.`);

        return { success: true };
    } catch (error) {
        console.error("Process order payment error:", error);
        return { success: false, error: "Failed to process order payment" };
    }
}

// Process subscription payment with validation
async function processSubscriptionPayment(subscriptionId, paymentData, session) {
    try {
        const { order_id, payment_id, signature, amount } = paymentData;

        // Validate subscription ID format
        if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
            return { success: false, error: "Invalid subscription ID format" };
        }

        // Find subscription with session for transaction
        const subscription = await Subscription.findById(subscriptionId).session(session);
        if (!subscription) {
            return { success: false, error: "Subscription not found" };
        }

        // Check if subscription is in a state that allows payment verification
        if (!['active', 'pending'].includes(subscription.status)) {
            return { success: false, error: `Subscription cannot be verified. Current status: ${subscription.status}` };
        }

        // Validate amount if provided
        if (amount) {
            const expectedAmount = subscription.bill || subscription.price;
            const receivedAmount = Number(amount);
            if (Math.abs(receivedAmount - expectedAmount) > 0.01) {
                return { success: false, error: `Amount mismatch. Expected: ${expectedAmount}, Received: ${receivedAmount}` };
            }
        }

        // Check for duplicate payment processing
        if (subscription.paymentStatus === 'verified' || subscription.paymentStatus === 'completed') {
            return { success: false, error: "Payment already processed for this subscription" };
        }

        // Update subscription with payment information
        subscription.status = 'active';
        subscription.paymentStatus = 'verified';
        subscription.paymentDetails = {
            razorpayOrderId: order_id,
            razorpayPaymentId: payment_id,
            razorpaySignature: signature,
            verifiedAt: new Date(),
            amount: amount || subscription.bill || subscription.price
        };
        subscription.updatedAt = new Date();

        await subscription.save({ session });
        console.log(`Subscription ${subscriptionId} payment verified and status updated to active.`);

        return { success: true };
    } catch (error) {
        console.error("Process subscription payment error:", error);
        return { success: false, error: "Failed to process subscription payment" };
    }
}

// Get subscription payment status
export const getSubscriptionPaymentStatus = async (req, res) => {
    try {
        const { subscriptionId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid subscription ID format"
            });
        }

        const subscription = await Subscription.findById(subscriptionId);
        if (!subscription) {
            return res.status(404).json({
                success: false,
                error: "Subscription not found"
            });
        }

        res.json({
            success: true,
            subscriptionId: subscription._id,
            status: subscription.status,
            paymentStatus: subscription.paymentStatus || 'pending',
            paymentDetails: subscription.paymentDetails || null,
            totalAmount: subscription.bill || subscription.price
        });

    } catch (error) {
        console.error("Get subscription payment status error:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Create COD order payment (no Razorpay, just mark as COD)
export const createCodOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                success: false,
                error: "Valid order ID is required"
            });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                error: "Order not found"
            });
        }

        // SECURITY: Verify order belongs to authenticated user
        const userId = req.user._id || req.user.userId;
        if (order.customer.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                error: "You are not authorized to pay for this order"
            });
        }

        // Check if order is in a state that allows COD
        if (!['pending', 'created'].includes(order.status)) {
            return res.status(400).json({
                success: false,
                error: `Order cannot be paid. Current status: ${order.status}`
            });
        }

        // Mark order as COD
        order.paymentDetails = {
            paymentMethod: 'cod',
            amount: order.totalPrice,
            currency: 'INR'
        };
        order.paymentStatus = 'pending'; // Will be collected on delivery
        order.updatedAt = new Date();

        await order.save();

        console.log(`✅ Order ${orderId} marked as COD - Amount: ₹${order.totalPrice}`);

        res.json({
            success: true,
            message: "Order placed with Cash on Delivery",
            orderId: order._id,
            orderId_display: order.orderId,
            amount: order.totalPrice,
            paymentMethod: 'cod'
        });

    } catch (error) {
        console.error("Create COD order error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to create COD order"
        });
    }
};

// Create COD subscription (no Razorpay, just mark as COD)
export const createCodSubscription = async (req, res) => {
    try {
        const { subscriptionId } = req.body;

        if (!subscriptionId || !mongoose.Types.ObjectId.isValid(subscriptionId)) {
            return res.status(400).json({
                success: false,
                error: "Valid subscription ID is required"
            });
        }

        const subscription = await Subscription.findById(subscriptionId);
        if (!subscription) {
            return res.status(404).json({
                success: false,
                error: "Subscription not found"
            });
        }

        // SECURITY: Verify subscription belongs to authenticated user
        const userId = req.user._id || req.user.userId;
        if (subscription.customer.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                error: "You are not authorized to pay for this subscription"
            });
        }

        // Check if subscription is in a state that allows COD
        if (!['pending'].includes(subscription.status)) {
            return res.status(400).json({
                success: false,
                error: `Subscription cannot be paid via COD. Current status: ${subscription.status}`
            });
        }

        // Mark subscription as COD and activate it
        subscription.paymentDetails = {
            paymentMethod: 'cod',
            amount: subscription.bill || subscription.price,
            currency: 'INR'
        };
        subscription.paymentStatus = 'pending'; // Will be collected over deliveries
        subscription.status = 'active'; // Activate the subscription
        subscription.updatedAt = new Date();

        await subscription.save();

        console.log(`✅ Subscription ${subscriptionId} marked as COD - Amount: ₹${subscription.bill || subscription.price}`);

        res.json({
            success: true,
            message: "Subscription activated with Cash on Delivery",
            subscriptionId: subscription._id,
            subscriptionId_display: subscription.subscriptionId,
            amount: subscription.bill || subscription.price,
            paymentMethod: 'cod'
        });

    } catch (error) {
        console.error("Create COD subscription error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to create COD subscription"
        });
    }
};
