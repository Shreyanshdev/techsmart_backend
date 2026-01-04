import Subscription, { generateSubscriptionProductId } from "../../models/subscription.js";
import razorpay from '../../config/razorpay.js';
import { Customer, DeliveryPartner } from "../../models/user.js";
import Tax from "../../models/tax.js";
import Address from "../../models/address.js";
import Branch from "../../models/branch.js";
import Product from "../../models/product.js";
import { googleMapsService } from '../../services/googleMapsService.js';
import {
  calculateDistance,
  generateMultiProductDeliverySchedule
} from './helpers.js';



// Get nearest branch based on customer location
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

export const createSubscriptionOrder = async (req, res) => {
  const { amount, currency, receipt } = req.body;

  if (!amount || !currency || !receipt) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const options = {
      amount: Math.round(Number(amount) * 100), // To paise
      currency: currency,
      receipt: receipt,
    };
    const order = await razorpay.orders.create(options);
    console.log("Razorpay order created:", order);
    res.json(order);
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    res.status(500).json({ error: error?.message || "Failed to create Razorpay order" });
  }
};

export const getSubscription = async (req, res) => {
  try {

    // Check if an ID parameter is provided
    if (!req.params.id) {
      console.log('🔍 No ID parameter provided, returning all subscriptions');
      // If no ID provided, return all subscriptions (admin functionality)
      const subscriptions = await Subscription.find({})
        .populate("customer", "name phone email")
        .populate("branch", "name address")
        .populate("deliveryPartner.partner", "name phone")
        .populate("deliveryAddress", "addressLine1 city state zipCode latitude longitude");

      return res.status(200).json({
        message: "All subscriptions fetched successfully",
        subscriptions: subscriptions
      });
    }

    console.log('🔍 ID parameter provided:', req.params.id);

    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('🔍 Invalid ObjectId format:', req.params.id);
      return res.status(400).json({
        message: "Invalid subscription ID format. ID must be a 24-character hexadecimal string."
      });
    }

    console.log('🔍 Querying database for subscription with ID:', req.params.id);

    const subscription = await Subscription.findById(req.params.id)
      .populate("customer", "name phone email")
      .populate("branch", "name address")
      .populate("deliveryPartner.partner", "name phone")
      .populate("deliveryAddress", "addressLine1 city state zipCode latitude longitude")
      .populate("products.productId", "name description");

    console.log('🔍 Database query result:', subscription ? 'Found' : 'Not found');

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    return res.status(200).json(subscription);
  } catch (error) {
    console.error("Get subscription error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getSubscriptionByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    const subscription = await Subscription.findOne({
      customer: customerId
    }).sort({ createdAt: -1 }).populate("deliveryAddress").populate("deliveryPartner.partner");

    if (!subscription) {
      return res.status(404).json({ message: "No subscription found for this customer" });
    }

    console.log('Fetched subscription deliveries:', subscription.deliveries);
    return res.status(200).json(subscription);
  } catch (error) {
    console.error("Get subscription by customer error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// Get all subscriptions for the logged-in customer (history)
export const getSubscriptionHistory = async (req, res) => {
  try {
    const customerId = req.user._id || req.user.userId;

    const subscriptions = await Subscription.find({ customer: customerId })
      .sort({ createdAt: -1 })
      .select('subscriptionId status products startDate endDate bill deliveries paymentDetails');

    return res.status(200).json({
      success: true,
      subscriptions: subscriptions.map(sub => {
        // Calculate totals from deliveries array if not set at subscription level
        const totalDeliveries = sub.deliveries?.length || 0;
        const deliveredCount = sub.deliveries?.filter(d => d.status === 'delivered').length || 0;

        return {
          _id: sub._id,
          subscriptionId: sub.subscriptionId,
          status: sub.status,
          products: sub.products.map(p => ({
            productName: p.productName,
            quantityValue: p.quantityValue,
            quantityUnit: p.quantityUnit
          })),
          startDate: sub.startDate,
          endDate: sub.endDate,
          bill: sub.bill,
          totalDeliveries: totalDeliveries,
          deliveredCount: deliveredCount,
          paymentDetails: sub.paymentDetails ? {
            paymentMethod: sub.paymentDetails.paymentMethod || 'online'
          } : { paymentMethod: 'online' }
        };
      })
    });
  } catch (error) {
    console.error("Get subscription history error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get detailed invoice for a specific subscription
export const getSubscriptionInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = req.user._id || req.user.userId;

    const subscription = await Subscription.findOne({
      _id: id,
      customer: customerId
    }).populate('deliveryAddress');

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Calculate delivered dates
    const deliveredDeliveries = subscription.deliveries
      .filter(d => d.status === 'delivered')
      .map(d => ({
        date: d.date,
        confirmedAt: d.confirmedAt || d.deliveredAt
      }));

    // Calculate subtotal (bill minus taxes)
    const sgstAmount = subscription.sgst || 0;
    const cgstAmount = subscription.cgst || 0;
    const subtotal = subscription.bill - sgstAmount - cgstAmount;

    return res.status(200).json({
      success: true,
      invoice: {
        subscriptionId: subscription.subscriptionId,
        status: subscription.status,
        purchaseDate: subscription.createdAt,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        products: subscription.products.map(p => ({
          productName: p.productName,
          quantityValue: p.quantityValue,
          quantityUnit: p.quantityUnit,
          unitPrice: p.unitPrice,
          monthlyPrice: p.monthlyPrice || (p.unitPrice * (p.totalDeliveries || 0)),
          totalDeliveries: p.totalDeliveries || 0,
          deliveredCount: p.deliveredCount || 0,
          remainingDeliveries: p.remainingDeliveries || 0
        })),
        totalDeliveries: subscription.deliveries?.length || 0,
        deliveredCount: subscription.deliveries?.filter(d => d.status === 'delivered').length || 0,
        remainingDeliveries: subscription.deliveries?.filter(d => d.status === 'scheduled').length || 0,
        subtotal: subtotal,
        bill: subscription.bill,
        sgst: sgstAmount,
        cgst: cgstAmount,
        paymentStatus: subscription.paymentStatus,
        paymentMethod: subscription.paymentDetails?.paymentMethod || 'online',
        deliveryAddress: subscription.deliveryAddress,
        deliveredDeliveries
      }
    });
  } catch (error) {
    console.error("Get subscription invoice error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    return res.status(200).json(subscription);
  } catch (error) {
    console.error("Update subscription error:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    const now = new Date();

    // Find the next scheduled delivery
    const nextDelivery = subscription.deliveries.find(d =>
      d.status === "scheduled" && new Date(d.date) >= now
    );

    if (!nextDelivery) {
      // If no future scheduled deliveries, allow cancellation immediately
      subscription.status = "Cancelled";
      await subscription.save();

      // Remove subscription reference from customer
      const customer = await Customer.findById(subscription.customer);
      if (customer && customer.subscription?.toString() === subscription._id.toString()) {
        customer.subscription = undefined;
        await customer.save();
      }
      return res.status(200).json({ message: "Subscription cancelled successfully" });
    }

    const nextDeliveryDate = new Date(nextDelivery.date);
    const cutoff = new Date(nextDeliveryDate.getTime() - subscription.cancellationCutoff * 60 * 60 * 1000);

    if (now > cutoff) {
      return res.status(400).json({
        message: `You can only cancel the subscription ${subscription.cancellationCutoff} hours before the next scheduled delivery (${nextDeliveryDate.toLocaleDateString()}).`
      });
    }

    // Mark all future scheduled deliveries as "canceled"
    subscription.deliveries.forEach(d => {
      if (new Date(d.date) >= nextDeliveryDate && d.status === "scheduled") {
        d.status = "canceled";
      }
    });

    subscription.status = "Cancelled";
    await subscription.save();

    // Remove subscription reference from customer
    const customer = await Customer.findById(subscription.customer);
    if (customer && customer.subscription?.toString() === subscription._id.toString()) {
      customer.subscription = undefined;
      await customer.save();
    }

    return res.status(200).json({ message: "Subscription cancelled successfully" });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// Simple delivery flow
export const startDelivery = async (req, res) => {
  try {
    const { subscriptionId, deliveryDate } = req.body;

    if (!subscriptionId || !deliveryDate) {
      return res.status(400).json({ message: "Subscription ID and delivery date are required" });
    }

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Find the specific delivery
    const delivery = subscription.deliveries.find(d =>
      d.date.toDateString() === new Date(deliveryDate).toDateString()
    );

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found for this date" });
    }

    if (delivery.status !== "scheduled") {
      return res.status(400).json({ message: "Delivery must be in scheduled status to start" });
    }

    // Change status to reaching - delivery partner is out for delivery
    delivery.status = "reaching";
    delivery.startedAt = new Date();

    await subscription.save();

    return res.status(200).json({
      message: "Delivery started successfully",
      delivery
    });
  } catch (error) {
    console.error("Start delivery error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// Assign delivery partner to subscription (admin only)
export const assignDeliveryPartner = async (req, res) => {
  try {
    const { subscriptionId, deliveryPartnerId } = req.body;

    if (!subscriptionId || !deliveryPartnerId) {
      return res.status(400).json({ message: "Subscription ID and delivery partner ID are required" });
    }

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Check if delivery partner exists
    const deliveryPartner = await DeliveryPartner.findById(deliveryPartnerId);
    if (!deliveryPartner) {
      return res.status(404).json({ message: "Delivery partner not found" });
    }

    // Assign delivery partner to subscription with full details
    subscription.deliveryPartner = {
      partner: deliveryPartnerId,
      phone: deliveryPartner.phone,
      name: deliveryPartner.name,
      currentLocation: {
        latitude: deliveryPartner.liveLocation?.latitude || 0,
        longitude: deliveryPartner.liveLocation?.longitude || 0,
        address: deliveryPartner.address || "Location not available"
      },
      assignedDate: new Date(),
      isActive: true
    };

    // Auto-schedule all deliveries for this delivery partner
    if (subscription.deliveries && subscription.deliveries.length > 0) {
      subscription.deliveries.forEach(delivery => {
        if (delivery.status === 'scheduled') {
          // Update delivery partner assignment for each delivery
          delivery.deliveryPartnerId = deliveryPartnerId;
          console.log(`Delivery for ${delivery.date} assigned to partner ${deliveryPartner.name}`);

          // Log multi-product delivery info
          if (delivery.products && delivery.products.length > 0) {
            console.log(`  - Multi-product delivery: ${delivery.products.length} products`);
            delivery.products.forEach(product => {
              console.log(`    * ${product.productName} (${product.quantity.value}${product.quantity.unit})`);
            });
          }
        }
      });
    }

    await subscription.save();

    // Emit socket event to notify delivery partner about new assignment
    if (req.app.get('io')) {
      req.app.get('io').to(`branch-${subscription.branch}`).emit('subscriptionAssigned', {
        subscriptionId: subscription._id,
        deliveryPartnerId: deliveryPartnerId,
        customerName: subscription.customer,
        totalDeliveries: subscription.deliveries?.length || 0
      });
    }

    return res.status(200).json({
      message: "Delivery partner assigned successfully",
      subscription: {
        _id: subscription._id,
        deliveryPartner: subscription.deliveryPartner,
        totalDeliveries: subscription.totalDeliveries,
        remainingDeliveries: subscription.remainingDeliveries
      }
    });
  } catch (error) {
    console.error("Assign delivery partner error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// Delivery partner marks delivery as delivered
export const markDeliveryDelivered = async (req, res) => {
  try {
    const { subscriptionId, deliveryDate, deliveryPartnerId } = req.body;

    if (!subscriptionId || !deliveryDate || !deliveryPartnerId) {
      return res.status(400).json({ message: "Subscription ID, delivery date, and delivery partner ID are required" });
    }

    const subscription = await Subscription.findById(subscriptionId)
      .populate('customer', 'name phone');

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Verify delivery partner assignment
    if (!subscription.deliveryPartner?.partner || subscription.deliveryPartner.partner.toString() !== deliveryPartnerId) {
      return res.status(403).json({ message: "Only assigned delivery partner can mark this delivery as delivered" });
    }

    // Find the specific delivery
    const delivery = subscription.deliveries.find(d =>
      d.date.toDateString() === new Date(deliveryDate).toDateString()
    );

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found for this date" });
    }

    if (delivery.status !== "reaching") {
      return res.status(400).json({ message: "Delivery must be in reaching status to mark as delivered" });
    }

    // Change status directly to delivered (no awaitingCustomer step)
    delivery.status = "delivered";
    delivery.deliveredAt = new Date();
    delivery.confirmedAt = new Date(); // Auto-confirm since we're not waiting for customer

    // Update individual product delivery statuses to delivered directly
    if (delivery.products && delivery.products.length > 0) {
      delivery.products.forEach(deliveryProduct => {
        deliveryProduct.deliveryStatus = 'delivered';

        // Find corresponding subscription product and update counts
        // Match by unique subscriptionProductId for exact product identification
        const subscriptionProduct = deliveryProduct.subscriptionProductId ?
          subscription.products.find(sp =>
            sp.subscriptionProductId === deliveryProduct.subscriptionProductId
          ) :
          // Fallback: match by productId and other properties if subscriptionProductId is not available (legacy)
          subscription.products.find(sp =>
            sp.productId.toString() === deliveryProduct.productId.toString() &&
            sp.animalType === deliveryProduct.animalType &&
            sp.quantityValue === deliveryProduct.quantityValue &&
            sp.quantityUnit === deliveryProduct.quantityUnit
          );

        if (subscriptionProduct) {
          // Validate and update counts
          if (subscriptionProduct.remainingDeliveries > 0) {
            subscriptionProduct.deliveredCount += 1;
            subscriptionProduct.remainingDeliveries -= 1;
            console.log(`📦 Delivery marked complete for ${subscriptionProduct.productName}: deliveredCount=${subscriptionProduct.deliveredCount}, remaining=${subscriptionProduct.remainingDeliveries}`);
          } else {
            console.warn(`⚠️ Cannot update counts for ${subscriptionProduct.productName}: remainingDeliveries is already 0 or negative (${subscriptionProduct.remainingDeliveries})`);
          }
        } else {
          console.warn(`⚠️ Could not find subscription product for delivery product: ${deliveryProduct.productName} (subscriptionProductId: ${deliveryProduct.subscriptionProductId})`);
        }
      });
      console.log(`✅ Delivery partner marked delivery as delivered: ${delivery.products.length} products`);
    }

    // Update subscription counts
    subscription.deliveredCount += 1;
    if (subscription.remainingDeliveries > 0) {
      subscription.remainingDeliveries -= 1;
    }

    await subscription.save();

    // Emit socket events to notify customer and delivery partner
    if (req.app.get('io')) {
      const io = req.app.get('io');

      // Notify customer that delivery is complete
      io.to(`customer-${subscription.customer.toString()}`).emit('deliveryCompleted', {
        subscriptionId: subscription._id,
        deliveryDate: deliveryDate,
        deliveryPartner: {
          name: subscription.deliveryPartner?.name || 'Delivery Partner',
          phone: subscription.deliveryPartner?.phone || 'Unknown'
        },
        products: delivery.products || [],
        message: 'Your delivery has been completed successfully.'
      });

      // Notify delivery partner that delivery is completed
      io.to(`deliveryPartner-${deliveryPartnerId}`).emit('deliveryCompleted', {
        subscriptionId: subscription._id,
        deliveryDate: deliveryDate,
        status: 'delivered',
        message: 'Delivery marked as completed.',
        customer: {
          name: subscription.customer?.name,
          phone: subscription.customer?.phone
        }
      });

      // Notify branch for monitoring
      io.to(`branch-${subscription.branch}`).emit('deliveryStatusUpdated', {
        subscriptionId: subscription._id,
        deliveryDate: deliveryDate,
        status: 'delivered',
        deliveryPartnerId: deliveryPartnerId,
        message: 'Delivery completed successfully'
      });
    }

    return res.status(200).json({
      message: "Delivery marked as delivered successfully",
      delivery: {
        _id: delivery._id,
        status: delivery.status,
        deliveredAt: delivery.deliveredAt,
        confirmedAt: delivery.confirmedAt,
        products: delivery.products || []
      },
      customer: {
        name: subscription.customer?.name,
        phone: subscription.customer?.phone
      },
      subscription: {
        deliveredCount: subscription.deliveredCount,
        remainingDeliveries: subscription.remainingDeliveries
      }
    });
  } catch (error) {
    console.error("Mark delivery delivered error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// Customer confirms delivery (this is the only way to mark as delivered)
export const confirmDeliveryByCustomer = async (req, res) => {
  try {
    const { subscriptionId, deliveryDate } = req.body;

    if (!subscriptionId || !deliveryDate) {
      return res.status(400).json({ message: "Subscription ID and delivery date are required" });
    }

    const subscription = await Subscription.findById(subscriptionId)
      .populate('customer', 'name phone')
      .populate('deliveryAddress');

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Find the specific delivery
    const delivery = subscription.deliveries.find(d =>
      d.date.toDateString() === new Date(deliveryDate).toDateString()
    );

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found for this date" });
    }

    if (delivery.status !== "awaitingCustomer") {
      return res.status(400).json({ message: "Delivery must be in awaitingCustomer status to confirm" });
    }

    // Change status to delivered and update counts
    delivery.status = "delivered";
    delivery.confirmedAt = new Date();

    // Update individual product delivery statuses
    if (delivery.products && delivery.products.length > 0) {
      delivery.products.forEach(product => {
        product.deliveryStatus = 'delivered';
      });
      console.log(`✅ Customer confirmed delivery: ${delivery.products.length} products delivered`);
    }

    // Update subscription counts with validation
    subscription.deliveredCount += 1;
    if (subscription.remainingDeliveries > 0) {
      subscription.remainingDeliveries -= 1;
    } else {
      console.warn(`⚠️ Cannot decrement subscription remainingDeliveries: already at 0 or negative (${subscription.remainingDeliveries})`);
    }

    // Update individual product delivery counts (only for delivered products)
    if (delivery.products && delivery.products.length > 0) {
      delivery.products.forEach(deliveryProduct => {
        // Find corresponding subscription product using unique subscriptionProductId
        const subscriptionProduct = deliveryProduct.subscriptionProductId ?
          subscription.products.find(sp =>
            sp.subscriptionProductId === deliveryProduct.subscriptionProductId
          ) :
          // Fallback: match by productId and other properties if subscriptionProductId is not available (legacy)
          subscription.products.find(sp =>
            sp.productId.toString() === deliveryProduct.productId.toString() &&
            sp.animalType === deliveryProduct.animalType &&
            sp.quantityValue === deliveryProduct.quantityValue &&
            sp.quantityUnit === deliveryProduct.quantityUnit
          );

        if (subscriptionProduct) {
          // Validate before updating counts to prevent negative values
          if (subscriptionProduct.remainingDeliveries > 0) {
            subscriptionProduct.deliveredCount += 1;
            subscriptionProduct.remainingDeliveries -= 1;
            console.log(`📦 Updated product ${subscriptionProduct.productName}: deliveredCount=${subscriptionProduct.deliveredCount}, remaining=${subscriptionProduct.remainingDeliveries}`);
          } else {
            console.warn(`⚠️ Cannot update counts for ${subscriptionProduct.productName}: remainingDeliveries is already 0 or negative (${subscriptionProduct.remainingDeliveries})`);
          }
        } else {
          console.warn(`⚠️ Could not find subscription product for delivery product: ${deliveryProduct.productName} (subscriptionProductId: ${deliveryProduct.subscriptionProductId})`);
        }
      });
    }

    await subscription.save();

    // Emit socket event for real-time updates
    if (req.app.get('io')) {
      req.app.get('io').to(`customer-${subscription.customer._id}`).emit('deliveryConfirmed', {
        subscriptionId: subscription._id,
        deliveryDate: deliveryDate,
        status: 'delivered',
        message: 'Delivery confirmed by customer'
      });

      req.app.get('io').to(`branch-${subscription.branch}`).emit('deliveryConfirmed', {
        subscriptionId: subscription._id,
        deliveryDate: deliveryDate,
        status: 'delivered'
      });
    }

    return res.status(200).json({
      message: "Delivery confirmed successfully by customer",
      delivery: {
        _id: delivery._id,
        status: delivery.status,
        confirmedAt: delivery.confirmedAt,
        products: delivery.products || []
      },
      subscription: {
        deliveredCount: subscription.deliveredCount,
        remainingDeliveries: subscription.remainingDeliveries
      }
    });
  } catch (error) {
    console.error("Confirm delivery by customer error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// Mark delivery as no response when customer is not available
export const markDeliveryNoResponse = async (req, res) => {
  try {
    const { subscriptionId, deliveryDate, deliveryPartnerId } = req.body;

    if (!subscriptionId || !deliveryDate || !deliveryPartnerId) {
      return res.status(400).json({ message: "Subscription ID, delivery date, and delivery partner ID are required" });
    }

    const subscription = await Subscription.findById(subscriptionId)
      .populate('customer', 'name phone');

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Verify delivery partner assignment
    if (!subscription.deliveryPartner?.partner || subscription.deliveryPartner.partner.toString() !== deliveryPartnerId) {
      return res.status(403).json({ message: "Only assigned delivery partner can mark this delivery as no response" });
    }

    // Find the specific delivery
    const delivery = subscription.deliveries.find(d =>
      d.date.toDateString() === new Date(deliveryDate).toDateString()
    );

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found for this date" });
    }

    if (delivery.status !== "reaching") {
      return res.status(400).json({ message: "Delivery must be in reaching status to mark as no response" });
    }

    // Change status to noResponse, but treat checks as delivered
    delivery.status = "noResponse";
    delivery.deliveredAt = new Date();
    delivery.confirmedAt = new Date(); // Auto-confirm

    // Update individual product delivery statuses to delivered (so it counts as delivered)
    if (delivery.products && delivery.products.length > 0) {
      delivery.products.forEach(deliveryProduct => {
        deliveryProduct.deliveryStatus = 'delivered';

        // Find corresponding subscription product and update counts
        const subscriptionProduct = deliveryProduct.subscriptionProductId ?
          subscription.products.find(sp =>
            sp.subscriptionProductId === deliveryProduct.subscriptionProductId
          ) :
          // Fallback
          subscription.products.find(sp =>
            sp.productId.toString() === deliveryProduct.productId.toString() &&
            sp.animalType === deliveryProduct.animalType &&
            sp.quantityValue === deliveryProduct.quantityValue &&
            sp.quantityUnit === deliveryProduct.quantityUnit
          );

        if (subscriptionProduct) {
          // Validate and update counts
          if (subscriptionProduct.remainingDeliveries > 0) {
            subscriptionProduct.deliveredCount += 1;
            subscriptionProduct.remainingDeliveries -= 1;
            console.log(`📦 No-response (counted as delivered) for ${subscriptionProduct.productName}: deliveredCount=${subscriptionProduct.deliveredCount}, remaining=${subscriptionProduct.remainingDeliveries}`);
          } else {
            console.warn(`⚠️ Cannot update counts for ${subscriptionProduct.productName}: remainingDeliveries is already 0 or negative (${subscriptionProduct.remainingDeliveries})`);
          }
        } else {
          console.warn(`⚠️ Could not find subscription product for delivery product: ${deliveryProduct.productName}`);
        }
      });
    }

    // Update subscription counts
    subscription.deliveredCount += 1;
    if (subscription.remainingDeliveries > 0) {
      subscription.remainingDeliveries -= 1;
    }

    await subscription.save();

    // Emit socket event for real-time updates - mimicking successful delivery flow
    if (req.app.get('io')) {
      const io = req.app.get('io');

      io.to(`customer-${subscription.customer._id}`).emit('deliveryNoResponse', {
        subscriptionId: subscription._id,
        deliveryDate: deliveryDate,
        status: 'noResponse',
        message: 'Delivery partner marked as no response - counted as delivered'
      });

      io.to(`branch-${subscription.branch}`).emit('deliveryNoResponse', {
        subscriptionId: subscription._id,
        deliveryDate: deliveryDate,
        status: 'noResponse'
      });

      // Also emit deliveryCompleted to partner so they see it as done
      io.to(`deliveryPartner-${deliveryPartnerId}`).emit('deliveryCompleted', {
        subscriptionId: subscription._id,
        deliveryDate: deliveryDate,
        status: 'noResponse',
        message: 'Delivery marked as no response.'
      });
    }

    return res.status(200).json({
      message: "Delivery marked as no response successfully",
      delivery: {
        _id: delivery._id,
        status: delivery.status,
        deliveredAt: delivery.deliveredAt,
        confirmedAt: delivery.confirmedAt,
        products: delivery.products || []
      },
      subscription: {
        deliveredCount: subscription.deliveredCount,
        remainingDeliveries: subscription.remainingDeliveries
      }
    });
  } catch (error) {
    console.error("Mark delivery no response error:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const updateDeliveryStatuses = async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({ message: "Subscription ID is required" });
    }

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    const today = new Date();
    const endDate = new Date(subscription.endDate);
    const daysToExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Update delivery statuses based on expiry
    let updated = false;
    if (subscription.deliveries) {
      subscription.deliveries.forEach(delivery => {
        if (delivery.status === 'scheduled' && daysToExpiry <= 3 && daysToExpiry >= 0) {
          delivery.status = 'expiring';
          updated = true;
        }
      });
    }

    if (updated) {
      await subscription.save();
    }

    return res.status(200).json({
      message: "Delivery statuses updated successfully",
      daysToExpiry,
      updated
    });
  } catch (error) {
    console.error("Update delivery statuses error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// Start delivery journey (update status to reaching)
export const startDeliveryJourney = async (req, res) => {
  try {
    const { subscriptionId, deliveryDate, deliveryPartnerId, partnerLocation } = req.body;

    if (!subscriptionId || !deliveryDate || !deliveryPartnerId) {
      return res.status(400).json({ message: "Subscription ID, delivery date, and delivery partner ID are required" });
    }

    const subscription = await Subscription.findById(subscriptionId)
      .populate('customer', 'name phone')
      .populate('deliveryAddress');

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Find the specific delivery
    const delivery = subscription.deliveries.find(d =>
      d.date.toDateString() === new Date(deliveryDate).toDateString()
    );

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found for this date" });
    }

    // Check if delivery is for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deliveryDateObj = new Date(delivery.date);
    deliveryDateObj.setHours(0, 0, 0, 0);

    if (deliveryDateObj.getTime() !== today.getTime()) {
      return res.status(400).json({ message: "Can only start delivery journey for today's deliveries" });
    }

    if (delivery.status !== "scheduled") {
      return res.status(400).json({ message: "Delivery must be in scheduled status to start journey" });
    }

    // Verify delivery partner assignment
    if (subscription.deliveryPartner?.partner && subscription.deliveryPartner.partner.toString() !== deliveryPartnerId) {
      return res.status(403).json({ message: "Only assigned delivery partner can start this delivery journey" });
    }

    // Update delivery status to reaching
    delivery.status = "reaching";
    delivery.startedAt = new Date();

    // Update delivery partner location if provided
    if (partnerLocation) {
      delivery.liveLocation = {
        latitude: partnerLocation.latitude,
        longitude: partnerLocation.longitude,
        address: partnerLocation.address || "Location not available",
        lastUpdated: new Date()
      };
    }

    await subscription.save();

    // Emit socket events to notify customer and delivery partner about delivery start
    if (req.app.get('io')) {
      const io = req.app.get('io');

      // Notify customer that delivery has started
      io.to(`customer-${subscription.customer.toString()}`).emit('deliveryStarted', {
        subscriptionId: subscription._id,
        deliveryDate: deliveryDate,
        deliveryPartner: {
          name: subscription.deliveryPartner?.name || 'Delivery Partner',
          phone: subscription.deliveryPartner?.phone || 'Unknown'
        },
        liveLocation: delivery.liveLocation
      });

      // Notify delivery partner of status change
      io.to(`deliveryPartner-${deliveryPartnerId}`).emit('deliveryStatusUpdated', {
        subscriptionId: subscription._id,
        deliveryDate: deliveryDate,
        status: 'reaching',
        message: 'Delivery journey started successfully'
      });

      // Notify branch for monitoring
      io.to(`branch-${subscription.branch}`).emit('deliveryStatusUpdated', {
        subscriptionId: subscription._id,
        deliveryDate: deliveryDate,
        status: 'reaching',
        deliveryPartnerId: deliveryPartnerId
      });
    }

    return res.status(200).json({
      message: "Delivery journey started successfully",
      delivery: {
        _id: delivery._id,
        status: delivery.status,
        startedAt: delivery.startedAt,
        liveLocation: delivery.liveLocation,
        products: delivery.products || []
      },
      customer: {
        name: subscription.customer?.name,
        phone: subscription.customer?.phone,
        address: subscription.deliveryAddress?.address
      }
    });
  } catch (error) {
    console.error("Start delivery journey error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// Get daily subscription deliveries for a specific delivery partner
export const getDailySubscriptionDeliveriesForPartner = async (req, res) => {
  try {
    const { partnerId } = req.params;

    console.log('🔍 getDailySubscriptionDeliveriesForPartner called with partnerId:', partnerId);

    if (!partnerId) {
      return res.status(400).json({ message: "Delivery partner ID is required" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    console.log('📅 Today date:', today.toDateString());

    // Find subscriptions assigned to this delivery partner
    const subscriptions = await Subscription.find({
      "deliveryPartner.partner": partnerId,
      status: { $in: ["active", "paused"] }
    })
      .populate('customer', 'name phone address')
      .populate('deliveryAddress'); // Populate the address reference

    console.log('📋 Found subscriptions count:', subscriptions.length);
    subscriptions.forEach(sub => {
      console.log(`  - Subscription ${sub.subscriptionId}: ${sub.deliveries?.length || 0} deliveries, address: ${sub.deliveryAddress?.addressLine1 || 'no address'}`);
    });

    const todayDeliveries = [];
    const upcomingDeliveries = [];

    subscriptions.forEach(subscription => {
      if (subscription.deliveries) {
        subscription.deliveries.forEach(delivery => {
          const deliveryDate = new Date(delivery.date);
          deliveryDate.setHours(0, 0, 0, 0);

          // Format address from deliveryAddress reference
          const addr = subscription.deliveryAddress;
          const formattedAddress = addr
            ? [addr.addressLine1, addr.addressLine2, addr.city, addr.state, addr.zipCode]
              .filter(Boolean)
              .join(', ')
            : 'Address not available';

          const deliveryInfo = {
            _id: delivery._id,
            subscriptionId: subscription._id,
            subscriptionDisplayId: subscription.subscriptionId, // Human-readable ID like SUB-00068
            customerName: subscription.customer?.name || 'Unknown',
            customerPhone: subscription.customer?.phone || 'Unknown',
            customerAddress: formattedAddress,
            // Include coordinates for Google Maps navigation
            deliveryLocation: {
              latitude: addr?.latitude || 0,
              longitude: addr?.longitude || 0,
              address: formattedAddress
            },
            date: delivery.date,
            slot: delivery.slot,
            status: delivery.status,
            subscriptionType: 'subscription',
            totalDeliveries: subscription.totalDeliveries,
            remainingDeliveries: subscription.remainingDeliveries,
            // Enhanced: Multi-product delivery information
            products: delivery.products || [],
            productCount: delivery.products ? delivery.products.length : 1,
            isMultiProduct: delivery.products && delivery.products.length > 1
          };

          if (deliveryDate.getTime() === today.getTime()) {
            todayDeliveries.push(deliveryInfo);
          } else if (deliveryDate > today) {
            upcomingDeliveries.push(deliveryInfo);
          }
        });
      }
    });

    // Sort today's deliveries by status priority and time
    todayDeliveries.sort((a, b) => {
      const statusPriority = { 'reaching': 1, 'awaitingCustomer': 2, 'scheduled': 3, 'paused': 4 };
      const aPriority = statusPriority[a.status] || 5;
      const bPriority = statusPriority[b.status] || 5;

      if (aPriority !== bPriority) return aPriority - bPriority;

      // If same priority, sort by time (morning first)
      const slotPriority = { 'morning': 1, 'evening': 2 };
      return (slotPriority[a.slot] || 3) - (slotPriority[b.slot] || 3);
    });

    // Sort upcoming deliveries by date
    upcomingDeliveries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    console.log('📊 Results:');
    console.log(`  - Today deliveries: ${todayDeliveries.length}`);
    console.log(`  - Upcoming deliveries: ${upcomingDeliveries.length}`);

    return res.status(200).json({
      todayDeliveries,
      upcomingDeliveries,
      totalToday: todayDeliveries.length,
      totalUpcoming: upcomingDeliveries.length
    });
  } catch (error) {
    console.error("Get daily subscription deliveries error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// Get detailed delivery information for multi-product deliveries
export const getDeliveryDetails = async (req, res) => {
  try {
    const { subscriptionId, deliveryDate } = req.params;

    console.log('🔍 getDeliveryDetails called with:', { subscriptionId, deliveryDate });

    if (!subscriptionId || !deliveryDate) {
      console.log('❌ Missing required parameters');
      return res.status(400).json({ message: "Subscription ID and delivery date are required" });
    }

    const subscription = await Subscription.findById(subscriptionId)
      .populate('customer', 'name phone address')
      .populate('deliveryAddress')
      .populate('branch', 'name address location')
      .populate('deliveryPartner.partner', 'name phone email');

    console.log('📋 Found subscription:', {
      _id: subscription?._id,
      subscriptionId: subscription?.subscriptionId,
      customer: subscription?.customer,
      deliveryAddress: subscription?.deliveryAddress,
      deliveriesCount: subscription?.deliveries?.length
    });

    if (!subscription) {
      console.log('❌ Subscription not found');
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Find the specific delivery
    const targetDate = new Date(deliveryDate);
    console.log('🎯 Looking for delivery on date:', targetDate.toDateString());

    const delivery = subscription.deliveries.find(d => {
      const deliveryDateStr = d.date.toDateString();
      console.log('📅 Checking delivery date:', deliveryDateStr, 'vs target:', targetDate.toDateString());
      return deliveryDateStr === targetDate.toDateString();
    });

    console.log('📦 Found delivery:', {
      _id: delivery?._id,
      date: delivery?.date,
      status: delivery?.status,
      productsCount: delivery?.products?.length,
      products: delivery?.products
    });

    if (!delivery) {
      console.log('❌ Delivery not found for this date');
      console.log('📋 Available deliveries:', subscription.deliveries.map(d => ({
        _id: d._id,
        date: d.date.toDateString(),
        status: d.status
      })));
      return res.status(404).json({ message: "Delivery not found for this date" });
    }

    // Enhanced delivery information with multi-product support
    const deliveryDetails = {
      _id: delivery._id,
      subscriptionId: subscription._id,
      date: delivery.date,
      slot: delivery.slot,
      status: delivery.status,
      cutoffTime: delivery.cutoffTime,
      startedAt: delivery.startedAt,
      deliveredAt: delivery.deliveredAt,
      confirmedAt: delivery.confirmedAt,
      liveLocation: delivery.liveLocation,

      // Customer information
      customer: {
        name: subscription.customer?.name || 'Unknown',
        phone: subscription.customer?.phone || 'Unknown',
        address: subscription.deliveryAddress ?
          `${subscription.deliveryAddress.addressLine1 || ''} ${subscription.deliveryAddress.addressLine2 || ''} ${subscription.deliveryAddress.city || ''} ${subscription.deliveryAddress.state || ''} ${subscription.deliveryAddress.zipCode || ''}`.trim() || 'Address not available' :
          'Address not available'
      },

      // Branch information
      branch: {
        name: subscription.branch?.name || 'Unknown',
        address: subscription.branch?.address || 'Unknown',
        location: subscription.branch?.location
      },

      // Multi-product delivery information
      products: delivery.products || [],
      productCount: delivery.products ? delivery.products.length : 1,
      isMultiProduct: delivery.products && delivery.products.length > 1,

      // Enhanced delivery partner information
      deliveryPartner: subscription.deliveryPartner ? {
        partner: subscription.deliveryPartner.partner,
        name: subscription.deliveryPartner.name || subscription.deliveryPartner.partner?.name,
        phone: subscription.deliveryPartner.phone || subscription.deliveryPartner.partner?.phone,
        email: subscription.deliveryPartner.partner?.email,
        currentLocation: subscription.deliveryPartner.currentLocation,
        assignedDate: subscription.deliveryPartner.assignedDate,
        isActive: subscription.deliveryPartner.isActive
      } : null,

      // Subscription summary
      subscription: {
        totalDeliveries: subscription.totalDeliveries,
        remainingDeliveries: subscription.remainingDeliveries,
        deliveredCount: subscription.deliveredCount,
        status: subscription.status
      }
    };

    console.log('✅ Returning delivery details:', {
      _id: deliveryDetails._id,
      status: deliveryDetails.status,
      customer: deliveryDetails.customer,
      productsCount: deliveryDetails.products?.length,
      products: deliveryDetails.products
    });

    return res.status(200).json({
      success: true,
      data: deliveryDetails
    });
  } catch (error) {
    console.error("❌ Get delivery details error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// Get active subscriptions for a delivery partner
export const getActiveSubscriptionsForPartner = async (req, res) => {
  try {
    const { partnerId } = req.params;

    console.log('🔍 getActiveSubscriptionsForPartner called with partnerId:', partnerId);

    if (!partnerId) {
      console.log('❌ Missing partner ID');
      return res.status(400).json({ message: "Delivery partner ID is required" });
    }

    // Find all active subscriptions assigned to this delivery partner
    const subscriptions = await Subscription.find({
      "deliveryPartner.partner": partnerId,
      status: { $in: ["active", "paused"] }
    })
      .populate('customer', 'name phone address')
      .populate('deliveryAddress')
      .populate('products.productId', 'name')
      .sort({ createdAt: -1 });

    console.log('📋 Found subscriptions:', {
      count: subscriptions.length,
      subscriptions: subscriptions.map(sub => ({
        _id: sub._id,
        subscriptionId: sub.subscriptionId,
        customer: sub.customer,
        deliveryAddress: sub.deliveryAddress,
        productsCount: sub.products?.length,
        status: sub.status
      }))
    });

    if (!subscriptions || subscriptions.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No active subscriptions found for this delivery partner"
      });
    }

    // Process subscriptions to get today's delivery status and product details
    const activeSubscriptions = subscriptions.map(subscription => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Find today's delivery
      const todayDelivery = subscription.deliveries.find(delivery => {
        const deliveryDate = new Date(delivery.date);
        deliveryDate.setHours(0, 0, 0, 0);
        return deliveryDate.getTime() === today.getTime();
      });

      // Get today's delivery status
      const todayDeliveryStatus = todayDelivery ? todayDelivery.status : 'no_delivery_today';

      // Calculate total deliveries and remaining from all products
      const totalDeliveries = subscription.products.reduce((sum, product) => {
        return sum + (product.totalDeliveries || 0);
      }, 0);

      const remainingDeliveries = subscription.products.reduce((sum, product) => {
        return sum + (product.remainingDeliveries || 0);
      }, 0);

      const deliveredCount = subscription.products.reduce((sum, product) => {
        return sum + (product.deliveredCount || 0);
      }, 0);

      // Process products with proper details including delivery tracking
      const processedProducts = subscription.products.map(product => {
        const productDetails = product.productId;
        return {
          productName: productDetails?.name || product.productName || 'Unknown Product',
          quantityValue: product.quantityValue,
          quantityUnit: product.quantityUnit,
          animalType: product.animalType || 'cow',
          unitPrice: product.unitPrice,
          monthlyPrice: product.monthlyPrice,
          deliveryFrequency: product.deliveryFrequency,
          // Individual product delivery tracking
          totalDeliveries: product.totalDeliveries || 0,
          deliveredCount: product.deliveredCount || 0,
          remainingDeliveries: product.remainingDeliveries || 0
        };
      });

      return {
        _id: subscription._id,
        subscriptionId: subscription.subscriptionId,
        customer: {
          name: subscription.customer?.name || 'Unknown Customer',
          phone: subscription.customer?.phone || 'Unknown Phone',
          address: subscription.deliveryAddress ?
            `${subscription.deliveryAddress.addressLine1 || ''} ${subscription.deliveryAddress.addressLine2 || ''} ${subscription.deliveryAddress.city || ''} ${subscription.deliveryAddress.state || ''} ${subscription.deliveryAddress.zipCode || ''}`.trim() || 'Address not available' :
            'Address not available'
        },
        todayDeliveryStatus,
        // Sum of all product deliveries
        totalDeliveries,
        deliveredCount,
        remainingDeliveries,
        products: processedProducts,
        slot: subscription.slot,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        status: subscription.status
      };
    });

    return res.status(200).json({
      success: true,
      data: activeSubscriptions,
      count: activeSubscriptions.length
    });

  } catch (error) {
    console.error("Get active subscriptions for partner error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// Get delivery history for a specific subscription
export const getSubscriptionDeliveryHistory = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    if (!subscriptionId) {
      return res.status(400).json({ message: "Subscription ID is required" });
    }

    const subscription = await Subscription.findById(subscriptionId)
      .populate('customer', 'name phone address')
      .populate('deliveryAddress');

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Get all past deliveries (delivered, canceled, noResponse)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pastDeliveries = subscription.deliveries.filter(delivery => {
      const deliveryDate = new Date(delivery.date);
      deliveryDate.setHours(0, 0, 0, 0);
      return deliveryDate < today && ['delivered', 'canceled', 'noResponse'].includes(delivery.status);
    });

    // Process delivery history
    const deliveryHistory = pastDeliveries.map(delivery => {
      // Get products for this delivery
      const deliveryProducts = delivery.products || [];

      // If no products array, create from legacy single product
      const products = deliveryProducts.length > 0 ? deliveryProducts : [{
        productId: delivery.productId,
        productName: 'Legacy Product',
        quantity: { value: 1, unit: 'piece' },
        unitPrice: 0,
        animalType: 'cow',
        deliveryStatus: delivery.status === 'delivered' ? 'delivered' : 'failed'
      }];

      return {
        _id: delivery._id,
        date: delivery.date,
        slot: delivery.slot,
        status: delivery.status,
        products: products.map(product => ({
          productId: product.productId,
          productName: product.productName || 'Unknown Product',
          quantity: product.quantity,
          unitPrice: product.unitPrice || 0,
          animalType: product.animalType || 'cow',
          deliveryStatus: product.deliveryStatus || (delivery.status === 'delivered' ? 'delivered' : 'failed')
        })),
        customer: {
          name: subscription.customer?.name || 'Unknown Customer',
          phone: subscription.customer?.phone || 'Unknown Phone',
          address: subscription.deliveryAddress ?
            `${subscription.deliveryAddress.addressLine1 || ''} ${subscription.deliveryAddress.addressLine2 || ''} ${subscription.deliveryAddress.city || ''} ${subscription.deliveryAddress.state || ''} ${subscription.deliveryAddress.zipCode || ''}`.trim() || 'Address not available' :
            'Address not available'
        },
        deliveredAt: delivery.deliveredAt,
        canceledAt: delivery.canceledAt,
        confirmedAt: delivery.confirmedAt,
        concession: delivery.concession || false
      };
    });

    // Sort by date (most recent first)
    deliveryHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return res.status(200).json({
      success: true,
      data: deliveryHistory,
      count: deliveryHistory.length,
      subscription: {
        _id: subscription._id,
        subscriptionId: subscription.subscriptionId,
        customer: subscription.customer?.name || 'Unknown Customer'
      }
    });

  } catch (error) {
    console.error("Get subscription delivery history error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// Get scheduled deliveries for a specific subscription
export const getSubscriptionScheduledDeliveries = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    console.log('🔍 getSubscriptionScheduledDeliveries called with subscriptionId:', subscriptionId);

    if (!subscriptionId) {
      console.log('❌ Missing subscription ID');
      return res.status(400).json({ message: "Subscription ID is required" });
    }

    const subscription = await Subscription.findById(subscriptionId)
      .populate('customer', 'name phone address')
      .populate('deliveryAddress');

    console.log('📋 Found subscription for scheduled deliveries:', {
      _id: subscription?._id,
      subscriptionId: subscription?.subscriptionId,
      customer: subscription?.customer,
      deliveryAddress: subscription?.deliveryAddress,
      deliveriesCount: subscription?.deliveries?.length
    });

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Get all scheduled deliveries (future and today's deliveries)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const scheduledDeliveries = subscription.deliveries.filter(delivery => {
      const deliveryDate = new Date(delivery.date);
      deliveryDate.setHours(0, 0, 0, 0);
      return deliveryDate >= today && ['scheduled', 'reaching', 'awaitingCustomer'].includes(delivery.status);
    });

    // Process scheduled deliveries
    const processedDeliveries = scheduledDeliveries.map(delivery => {
      // Get products for this delivery
      const deliveryProducts = delivery.products || [];

      // If no products array, create from legacy single product
      const products = deliveryProducts.length > 0 ? deliveryProducts : [{
        productId: delivery.productId,
        productName: 'Legacy Product',
        quantity: { value: 1, unit: 'piece' },
        unitPrice: 0,
        animalType: 'cow',
        deliveryStatus: delivery.status === 'delivered' ? 'delivered' : 'pending'
      }];

      return {
        _id: delivery._id,
        date: delivery.date,
        slot: delivery.slot,
        status: delivery.status,
        products: products.map(product => ({
          productId: product.productId,
          productName: product.productName || 'Unknown Product',
          quantityValue: product.quantityValue,
          quantityUnit: product.quantityUnit,
          unitPrice: product.unitPrice || 0,
          animalType: product.animalType || 'cow',
          deliveryStatus: product.deliveryStatus || 'pending'
        })),
        customer: {
          name: subscription.customer?.name || 'Unknown Customer',
          phone: subscription.customer?.phone || 'Unknown Phone',
          address: subscription.deliveryAddress ?
            `${subscription.deliveryAddress.addressLine1 || ''} ${subscription.deliveryAddress.addressLine2 || ''} ${subscription.deliveryAddress.city || ''} ${subscription.deliveryAddress.state || ''} ${subscription.deliveryAddress.zipCode || ''}`.trim() || 'Address not available' :
            'Address not available'
        },
        startedAt: delivery.startedAt,
        deliveredAt: delivery.deliveredAt,
        confirmedAt: delivery.confirmedAt,
        liveLocation: delivery.liveLocation
      };
    });

    // Sort by date (today's deliveries first, then future deliveries)
    processedDeliveries.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Today's deliveries first
      const isTodayA = dateA.getTime() === today.getTime();
      const isTodayB = dateB.getTime() === today.getTime();

      if (isTodayA && !isTodayB) return -1;
      if (!isTodayA && isTodayB) return 1;

      // Then sort by date
      return dateA.getTime() - dateB.getTime();
    });

    return res.status(200).json({
      success: true,
      data: processedDeliveries,
      count: processedDeliveries.length,
      subscription: {
        _id: subscription._id,
        subscriptionId: subscription.subscriptionId,
        customer: subscription.customer?.name || 'Unknown Customer'
      }
    });

  } catch (error) {
    console.error("Get subscription scheduled deliveries error:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const getPartnerScheduledDeliveries = async (req, res) => {
  try {
    const { partnerId } = req.params;

    if (!partnerId) {
      return res.status(400).json({ message: "Delivery partner ID is required" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find all subscriptions with assigned deliveries for this partner
    const subscriptions = await Subscription.find({
      "deliveryPartner.partner": partnerId,
      "deliveries.partnerId": partnerId,
      "deliveries.status": "scheduled"
    }).populate("customer deliveryAddress product");

    let scheduledDeliveries = [];

    subscriptions.forEach(subscription => {
      subscription.deliveries.forEach(delivery => {
        if (delivery.partnerId &&
          delivery.partnerId.toString() === partnerId &&
          delivery.status === "scheduled" &&
          delivery.date >= today) {

          scheduledDeliveries.push({
            subscriptionId: subscription._id,
            deliveryId: delivery._id,
            deliveryDate: delivery.date,
            slot: delivery.slot,
            status: delivery.status,
            subscription: {
              milkType: subscription.milkType,
              quantity: subscription.quantity,
              animal: subscription.animal,
              customerName: subscription.customer?.name || "Unknown",
              customerPhone: subscription.customer?.phone || "Unknown",
              deliveryAddress: subscription.deliveryAddress,
              product: subscription.product
            }
          });
        }
      });
    });

    // Sort by delivery date (today's deliveries first)
    scheduledDeliveries.sort((a, b) => {
      const aDate = new Date(a.deliveryDate);
      const bDate = new Date(b.deliveryDate);

      // Today's deliveries come first
      if (aDate.toDateString() === today.toDateString() && bDate.toDateString() !== today.toDateString()) return -1;
      if (bDate.toDateString() === today.toDateString() && aDate.toDateString() !== today.toDateString()) return 1;

      // Then sort by date
      return aDate.getTime() - bDate.getTime();
    });

    return res.status(200).json({
      message: "Scheduled deliveries fetched successfully",
      deliveries: scheduledDeliveries,
      totalCount: scheduledDeliveries.length
    });
  } catch (error) {
    console.error("Get partner scheduled deliveries error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPartnerCompletedDeliveries = async (req, res) => {
  try {
    const { partnerId } = req.params;

    if (!partnerId) {
      return res.status(400).json({ message: "Delivery partner ID is required" });
    }

    // Find all subscriptions with completed deliveries for this partner
    const subscriptions = await Subscription.find({
      "deliveryPartner.partner": partnerId,
      "deliveries.partnerId": partnerId,
      "deliveries.status": "delivered"
    }).populate("customer deliveryAddress product");

    let completedDeliveries = [];

    subscriptions.forEach(subscription => {
      subscription.deliveries.forEach(delivery => {
        if (delivery.partnerId &&
          delivery.partnerId.toString() === partnerId &&
          delivery.status === "delivered") {

          completedDeliveries.push({
            subscriptionId: subscription._id,
            deliveryId: delivery._id,
            deliveryDate: delivery.date,
            slot: delivery.slot,
            status: delivery.status,
            deliveredAt: delivery.deliveredAt,
            confirmedAt: delivery.confirmedAt,
            subscription: {
              milkType: subscription.milkType,
              quantity: subscription.quantity,
              animal: subscription.animal,
              customerName: subscription.customer?.name || "Unknown",
              customerPhone: subscription.customer?.phone || "Unknown",
              deliveryAddress: subscription.deliveryAddress,
              product: subscription.product
            }
          });
        }
      });
    });

    // Sort by delivery date (most recent first)
    completedDeliveries.sort((a, b) => {
      const aDate = new Date(a.deliveryDate);
      const bDate = new Date(b.deliveryDate);
      return bDate.getTime() - aDate.getTime();
    });

    return res.status(200).json({
      message: "Completed deliveries fetched successfully",
      deliveries: completedDeliveries,
      totalCount: completedDeliveries.length
    });
  } catch (error) {
    console.error("Get partner completed deliveries error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all subscriptions (for admin)
export const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({})
      .populate('customer', 'name phone email')
      .populate('branch', 'name address')
      .populate('deliveryPartner.partner', 'name phone')
      .populate('deliveryAddress', 'addressLine1 city state zipCode')
      .populate('products.productId', 'name description');

    // Format subscriptions to include proper product information
    const formattedSubscriptions = subscriptions.map(subscription => {
      const formattedProducts = subscription.products.map(product => ({
        productId: product.productId,
        productName: product.productName,
        quantityValue: product.quantityValue,
        quantityUnit: product.quantityUnit,
        unitPrice: product.unitPrice,
        monthlyPrice: product.monthlyPrice,
        deliveryFrequency: product.deliveryFrequency,
        totalDeliveries: product.totalDeliveries,
        deliveredCount: product.deliveredCount,
        remainingDeliveries: product.remainingDeliveries
      }));

      return {
        ...subscription.toObject(),
        products: formattedProducts,
        // Legacy single product support for backward compatibility
        product: formattedProducts.length > 0 ? formattedProducts[0] : null
      };
    });

    console.log('🔍 Admin API - Returning subscriptions with formatted products:', {
      subscriptionsCount: formattedSubscriptions.length,
      firstSubscription: formattedSubscriptions[0] ? {
        subscriptionId: formattedSubscriptions[0].subscriptionId,
        productsCount: formattedSubscriptions[0].products?.length,
        firstProduct: formattedSubscriptions[0].products?.[0] ? {
          name: formattedSubscriptions[0].products[0].productName,
          quantityValue: formattedSubscriptions[0].products[0].quantityValue,
          quantityUnit: formattedSubscriptions[0].products[0].quantityUnit
        } : 'No products'
      } : 'No subscriptions'
    });

    return res.status(200).json({
      message: "Subscriptions fetched successfully",
      subscriptions: formattedSubscriptions
    });
  } catch (error) {
    console.error("Get subscriptions error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get subscription by ID
export const getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findById(id)
      .populate('customer', 'name phone email')
      .populate('branch', 'name address')
      .populate('deliveryPartner.partner', 'name phone')
      .populate('deliveryAddress', 'addressLine1 city state zipCode');

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    return res.status(200).json({
      message: "Subscription fetched successfully",
      subscription: subscription
    });
  } catch (error) {
    console.error("Get subscription by ID error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete subscription
export const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findById(id);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Check if subscription can be deleted (not active)
    if (subscription.status === "active") {
      return res.status(400).json({ message: "Cannot delete active subscription. Please cancel it first." });
    }

    await Subscription.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Subscription deleted successfully"
    });
  } catch (error) {
    console.error("Delete subscription error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Force delete subscription for payment failures (bypasses active status check)
export const forceDeleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('🗑️ Force deleting subscription:', id);

    const subscription = await Subscription.findById(id);
    if (!subscription) {
      console.log('❌ Subscription not found:', id);
      return res.status(404).json({ message: "Subscription not found" });
    }

    console.log('📋 Subscription found:', {
      id: subscription._id,
      status: subscription.status,
      customer: subscription.customer,
      createdAt: subscription.createdAt
    });

    // Force delete regardless of status (for payment failures)
    await Subscription.findByIdAndDelete(id);

    console.log('✅ Subscription force deleted successfully:', id);

    return res.status(200).json({
      message: "Subscription force deleted successfully"
    });
  } catch (error) {
    console.error("Force delete subscription error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Confirm pickup and start real-time tracking
export const confirmPickup = async (req, res) => {
  try {
    const { subscriptionId, deliveryDate, deliveryPartnerId, location } = req.body;

    if (!subscriptionId || !deliveryDate || !deliveryPartnerId) {
      return res.status(400).json({ message: "Subscription ID, delivery date, and delivery partner ID are required" });
    }

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Find the specific delivery
    const delivery = subscription.deliveries.find(d =>
      d.date.toDateString() === new Date(deliveryDate).toDateString()
    );

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found for this date" });
    }

    if (delivery.status !== "scheduled") {
      return res.status(400).json({ message: "Delivery must be in scheduled status to confirm pickup" });
    }

    // Verify delivery partner assignment
    if (!subscription.deliveryPartner?.partner || subscription.deliveryPartner.partner.toString() !== deliveryPartnerId) {
      return res.status(403).json({ message: "Only assigned delivery partner can confirm pickup" });
    }

    // Update delivery status and pickup details
    delivery.status = "reaching";
    delivery.startedAt = new Date();

    if (location) {
      delivery.liveLocation = {
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address || "Current location",
        lastUpdated: new Date()
      };
    }

    await subscription.save();

    // Emit socket event for real-time updates
    if (req.app.get('io')) {
      req.app.get('io').to(`branch-${subscription.branch}`).emit('deliveryStarted', {
        subscriptionId: subscription._id,
        deliveryDate: deliveryDate,
        status: 'reaching'
      });
    }

    return res.status(200).json({
      message: "Pickup confirmed successfully",
      delivery: delivery
    });
  } catch (error) {
    console.error("Confirm pickup error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// Update real-time location
export const updateRealTimeLocation = async (req, res) => {
  try {
    const { subscriptionId, deliveryDate, deliveryPartnerId, location } = req.body;

    if (!subscriptionId || !deliveryDate || !deliveryPartnerId || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Find the specific delivery
    const delivery = subscription.deliveries.find(d =>
      d.date.toDateString() === new Date(deliveryDate).toDateString()
    );

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found for this date" });
    }

    // Verify delivery partner assignment
    if (!subscription.deliveryPartner?.partner || subscription.deliveryPartner.partner.toString() !== deliveryPartnerId) {
      return res.status(403).json({ message: "Only assigned delivery partner can update location" });
    }

    // Update real-time location
    delivery.liveLocation = {
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address || "Current location",
      lastUpdated: new Date()
    };

    await subscription.save();

    // Emit socket event for real-time location updates to both customer and delivery partner
    if (req.app.get('io')) {
      const io = req.app.get('io');

      // Emit to customer room for real-time tracking
      io.to(`customer-${subscription.customer.toString()}`).emit('deliveryLocationUpdated', {
        subscriptionId: subscription._id,
        deliveryDate: deliveryDate,
        location: delivery.liveLocation
      });

      // Emit to delivery partner room for coordination
      io.to(`deliveryPartner-${deliveryPartnerId}`).emit('locationUpdate', {
        subscriptionId: subscription._id,
        deliveryDate: deliveryDate,
        location: delivery.liveLocation
      });

      // Emit to branch room for admin/monitoring
      io.to(`branch-${subscription.branch}`).emit('deliveryLocationUpdate', {
        subscriptionId: subscription._id,
        deliveryDate: deliveryDate,
        location: delivery.liveLocation
      });
    }

    return res.status(200).json({
      message: "Location updated successfully",
      delivery: delivery
    });
  } catch (error) {
    console.error("Update real-time location error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// Update live location during delivery
export const updateLiveLocation = async (req, res) => {
  try {
    const { subscriptionId, deliveryDate, location } = req.body;

    if (!subscriptionId || !deliveryDate || !location) {
      return res.status(400).json({ message: "Subscription ID, delivery date, and location are required" });
    }

    const subscription = await Subscription.findById(subscriptionId)
      .populate('customer', 'name phone');

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Find the specific delivery
    const delivery = subscription.deliveries.find(d =>
      d.date.toDateString() === new Date(deliveryDate).toDateString()
    );

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found for this date" });
    }

    if (delivery.status !== "reaching") {
      return res.status(400).json({ message: "Can only update location when delivery is in reaching status" });
    }

    // Update live location
    delivery.liveLocation = {
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address || "Location not available",
      lastUpdated: new Date()
    };

    await subscription.save();

    // Emit real-time location update to customer
    if (req.app.get('io')) {
      req.app.get('io').to(`customer-${subscription.customer._id}`).emit('deliveryLocationUpdate', {
        subscriptionId: subscription._id,
        deliveryDate: deliveryDate,
        location: delivery.liveLocation,
        deliveryPartner: {
          name: subscription.deliveryPartner?.name || 'Delivery Partner',
          phone: subscription.deliveryPartner?.phone || 'Unknown'
        }
      });
    }

    return res.status(200).json({
      message: "Live location updated successfully",
      location: delivery.liveLocation,
      lastUpdated: delivery.liveLocation.lastUpdated
    });
  } catch (error) {
    console.error("Update live location error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// Customer confirms delivery receipt
export const confirmDeliveryReceipt = async (req, res) => {
  try {
    const { subscriptionId, deliveryDate, customerId } = req.body;

    if (!subscriptionId || !deliveryDate || !customerId) {
      return res.status(400).json({ message: "Subscription ID, delivery date, and customer ID are required" });
    }

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Verify customer ownership
    if (subscription.customer.toString() !== customerId) {
      return res.status(403).json({ message: "Only subscription owner can confirm delivery" });
    }

    // Find the specific delivery
    const delivery = subscription.deliveries.find(d =>
      d.date.toDateString() === new Date(deliveryDate).toDateString()
    );

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found for this date" });
    }

    if (delivery.status !== "awaitingCustomer") {
      return res.status(400).json({ message: "Delivery must be in awaitingCustomer status to confirm receipt" });
    }

    // Update delivery status to delivered
    delivery.status = "delivered";
    delivery.confirmedAt = new Date();
    delivery.deliveryTime = new Date();

    // Update subscription counts
    subscription.deliveredCount = subscription.deliveries.filter(d => d.status === "delivered").length;
    subscription.remainingDeliveries = subscription.totalDeliveries - subscription.deliveredCount;

    await subscription.save();

    // Emit socket event for real-time updates
    // This will be handled by your socket.io implementation

    return res.status(200).json({
      message: "Delivery confirmed successfully",
      delivery: delivery,
      subscription: {
        deliveredCount: subscription.deliveredCount,
        remainingDeliveries: subscription.remainingDeliveries
      }
    });
  } catch (error) {
    console.error("Confirm delivery receipt error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// Validate and fix delivery counts
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
    const actualCanceledCount = subscription.deliveries.filter(d => d.status === "canceled").length;

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




// Enhanced subscription creation for multi-product subscriptions
export const createEnhancedSubscription = async (req, res) => {
  try {
    console.log('🔍 createEnhancedSubscription called');
    console.log('🔍 Request body:', req.body);
    console.log('🔍 Request body products:', req.body.products);
    const {
      customerId,
      products, // Array of product selections with individual frequencies
      slot,
      startDate,
      endDate,
      addressId,
      branchId, // Branch ID from frontend
      branchName, // Branch name as fallback
      customerLocation
    } = req.body;

    // Validate required fields
    if (!customerId || !products || !Array.isArray(products) || products.length === 0 ||
      !slot || !startDate || !endDate || !addressId || (!branchId && !branchName)) {
      return res.status(400).json({
        message: "All required fields must be provided: customerId, products array, slot, startDate, endDate, addressId, and either branchId or branchName"
      });
    }

    // Validate slot
    if (!["morning", "evening"].includes(slot)) {
      return res.status(400).json({ message: "Invalid slot. Must be 'morning' or 'evening'" });
    }

    // Validate products array and their individual frequencies
    for (const product of products) {
      if (!product.productId || !product.selectedQuantity || !product.animalType || !product.deliveryFrequency) {
        return res.status(400).json({
          message: "Each product must have productId, selectedQuantity, animalType, and deliveryFrequency"
        });
      }

      // Validate count field
      if (product.count && (!Number.isInteger(product.count) || product.count < 1)) {
        return res.status(400).json({
          message: "Count must be a positive integer"
        });
      }

      if (!["daily", "alternate", "weekly", "monthly"].includes(product.deliveryFrequency)) {
        return res.status(400).json({
          message: `Invalid delivery frequency for product ${product.productId}. Must be 'daily', 'alternate', 'weekly', or 'monthly'`
        });
      }
    }

    // Get customer address for validation
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Branch lookup logic
    let nearestBranch;
    if (branchId) {
      nearestBranch = await Branch.findById(branchId).select('_id name address location');
      if (!nearestBranch) {
        return res.status(404).json({
          message: `Branch with ID "${branchId}" not found`
        });
      }
    } else if (branchName) {
      nearestBranch = await Branch.findOne({ name: branchName }).select('_id name address location');
      if (!nearestBranch) {
        return res.status(404).json({
          message: `Branch "${branchName}" not found`
        });
      }
    } else {
      return res.status(400).json({
        message: "Either branchId or branchName must be provided"
      });
    }

    console.log('🔍 Backend - Found branch:', nearestBranch.name, 'ID:', nearestBranch._id);
    console.log('🔍 Backend - Full branch object:', JSON.stringify(nearestBranch, null, 2));

    // Calculate total pricing for each product based on their individual frequencies
    const calculatedProducts = [];

    // Debug: Log incoming products data
    console.log('🔍 Incoming Products Data:', JSON.stringify(products, null, 2));

    for (const product of products) {
      console.log('🔍 Processing Product:', {
        productId: product.productId,
        selectedQuantity: product.selectedQuantity,
        selectedQuantityType: typeof product.selectedQuantity,
        animalType: product.animalType,
        deliveryFrequency: product.deliveryFrequency,
        unitPrice: product.unitPrice,
        monthlyPrice: product.monthlyPrice
      });
      // Get product details from database for accurate pricing
      const productDetails = await Product.findById(product.productId);
      if (!productDetails) {
        return res.status(404).json({
          message: `Product with ID ${product.productId} not found`
        });
      }

      // Debug: Check if product has any data at all
      console.log('🔍 Full Product Details:', JSON.stringify(productDetails, null, 2));

      // Debug: Log product structure
      console.log('🔍 Product Details:', {
        id: productDetails._id,
        name: productDetails.name,
        animalTypes: productDetails.animalTypes,
        hasAnimalTypes: !!productDetails.animalTypes,
        animalTypesType: typeof productDetails.animalTypes,
        isArray: Array.isArray(productDetails.animalTypes),
        sampleAnimalType: productDetails.animalTypes?.[0],
        sampleVariants: productDetails.animalTypes?.[0]?.variants
      });

      // Check if product has animal types data, if not, create it or use fallback pricing
      let unitPrice;
      if (!productDetails.animalTypes || !Array.isArray(productDetails.animalTypes) || productDetails.animalTypes.length === 0) {
        console.log('⚠️ Product has no animal types data, attempting to create or use fallback');

        // Try to create the missing animalTypes structure
        if (product.animalType && product.selectedQuantity && product.unitPrice) {
          try {
            // Create the missing animalTypes structure
            const newAnimalType = {
              type: product.animalType,
              variants: [{
                quantity: product.selectedQuantity,
                unit: product.selectedQuantity.includes('ml') ? 'ml' :
                  product.selectedQuantity.includes('g') ? 'g' :
                    product.selectedQuantity.includes('kg') ? 'kg' : 'l',
                price: product.unitPrice
              }],
              nutrition: {
                protein: 0,
                carbohydrate: 0,
                fat: 0,
                calcium: 0,
                energy: 0
              },
              images: []
            };

            // Note: With unified product model, animal types are now part of the product itself
            // No need to dynamically update product structure
            console.log('✅ Using product animal type:', newAnimalType.type);

            console.log('✅ Product supports subscriptions');

            // Use the unitPrice sent from frontend
            unitPrice = product.unitPrice;

          } catch (error) {
            console.log('❌ Failed to validate product, using fallback pricing');
            unitPrice = product.unitPrice || 0;
          }
        } else {
          // Use the unitPrice sent from frontend as fallback
          unitPrice = product.unitPrice || 0;
        }

        if (unitPrice === 0) {
          return res.status(400).json({
            message: `Product ${productDetails.name} has no pricing data and no fallback price provided`
          });
        }

        console.log('✅ Using pricing:', { unitPrice, productName: productDetails.name });
      } else {
        // Validate product structure
        if (!Array.isArray(productDetails.animalTypes)) {
          return res.status(400).json({
            message: `Product ${productDetails.name} has invalid animal types structure`
          });
        }

        // Get animal type variant
        const animalVariant = productDetails.animalTypes.find(
          at => at.type === product.animalType
        );
        if (!animalVariant) {
          return res.status(400).json({
            message: `Animal type ${product.animalType} not available for product ${productDetails.name}. Available types: ${productDetails.animalTypes.map(v => v.type).join(', ')}`
          });
        }

        // Validate animal variant structure
        if (!animalVariant.variants || !Array.isArray(animalVariant.variants)) {
          return res.status(400).json({
            message: `Product ${productDetails.name} has invalid variants structure for animal type ${product.animalType}`
          });
        }

        // Get quantity variant - handle string format from frontend
        const quantityVariant = animalVariant.variants.find(
          qv => qv.quantity === product.selectedQuantity
        );

        if (!quantityVariant) {
          return res.status(400).json({
            message: `Quantity ${product.selectedQuantity} not available for product ${productDetails.name}. Available quantities: ${animalVariant.variants.map(q => q.quantity).join(', ')}`
          });
        }

        // Use database price
        unitPrice = quantityVariant.price;
        console.log('✅ Using database pricing:', { unitPrice, productName: productDetails.name });
      }

      // Calculate delivery parameters based on individual product frequency
      let productDeliveries = 30;
      let deliveryGap = 1;

      switch (product.deliveryFrequency) {
        case "daily":
          productDeliveries = 30;
          deliveryGap = 1;
          break;
        case "alternate":
          productDeliveries = 15;
          deliveryGap = 2;
          break;
        case "weekly":
          productDeliveries = 5;
          deliveryGap = 7;
          break;
        case "monthly":
          productDeliveries = 1;
          deliveryGap = 30;
          break;
      }

      // Use the monthlyPrice calculated by frontend, or calculate if not provided
      const frontendMonthlyPrice = product.monthlyPrice;
      const productCount = product.count || 1;
      const backendCalculatedPrice = unitPrice * productDeliveries * productCount;

      // Validate frontend price - if it's significantly different from backend calculation, use backend
      const priceDifference = Math.abs(frontendMonthlyPrice - backendCalculatedPrice);
      const priceTolerance = backendCalculatedPrice * 0.1; // 10% tolerance

      let monthlyPrice;
      if (frontendMonthlyPrice && priceDifference <= priceTolerance) {
        monthlyPrice = frontendMonthlyPrice;
        console.log(`   - Using Frontend Price: ₹${monthlyPrice} (within tolerance)`);
      } else {
        // Strict validation as requested: Mismatch is a disaster, so block it.
        console.error(`❌ Price Mismatch Detected! Frontend: ₹${frontendMonthlyPrice}, Backend: ₹${backendCalculatedPrice}`);
        return res.status(400).json({
          message: "Price mismatch detected between app and server. Please try again or contact support."
        });
      }

      console.log(`🔍 Price Comparison for ${productDetails.name}:`);
      console.log(`   - Delivery Frequency: ${product.deliveryFrequency}`);
      console.log(`   - Product Deliveries: ${productDeliveries}`);
      console.log(`   - Unit Price: ₹${unitPrice}`);
      console.log(`   - Frontend Monthly Price: ₹${frontendMonthlyPrice || 'Not provided'}`);
      console.log(`   - Backend Calculated Price: ₹${backendCalculatedPrice} (${unitPrice} × ${productDeliveries} × ${productCount})`);
      console.log(`   - Using: ₹${monthlyPrice} (${frontendMonthlyPrice ? 'Frontend' : 'Backend'})`);

      // Generate product-specific delivery schedule
      const productDeliverySchedule = [];
      const productStartDate = new Date(startDate);
      for (let i = 0; i < productDeliveries; i++) {
        const deliveryDate = new Date(productStartDate);
        deliveryDate.setDate(productStartDate.getDate() + (i * deliveryGap));

        productDeliverySchedule.push({
          date: new Date(deliveryDate),
          slot: slot.toLowerCase(),
          status: "scheduled",
          isCustom: false
        });
      }

      // Parse selectedQuantity properly (format: "500ml", "1kg", etc.)
      console.log('🔍 Parsing quantity for product:', product.productName, 'selectedQuantity:', product.selectedQuantity);
      const quantityMatch = product.selectedQuantity.match(/(\d+(?:\.\d+)?)\s*([a-zA-Z]+)/);
      const quantityValue = quantityMatch ? parseFloat(quantityMatch[1]) : 1;
      const quantityUnit = quantityMatch ? quantityMatch[2] : 'ml';

      console.log('🔍 Quantity parsing result:', {
        original: product.selectedQuantity,
        match: quantityMatch,
        value: quantityValue,
        unit: quantityUnit,
        parsed: { value: quantityValue, unit: quantityUnit }
      });

      // Generate unique subscription product ID
      const subscriptionProductId = await generateSubscriptionProductId();

      calculatedProducts.push({
        subscriptionProductId: subscriptionProductId,
        productId: product.productId,
        productName: product.productName || productDetails.name,
        quantityValue: quantityValue,
        quantityUnit: quantityUnit,
        unitPrice: unitPrice,
        monthlyPrice: monthlyPrice,
        deliveryFrequency: product.deliveryFrequency,
        deliveryGap: deliveryGap,
        maxDeliveries: productDeliveries,
        totalDeliveries: productDeliveries,
        deliveredCount: 0,
        remainingDeliveries: productDeliveries,
        animalType: product.animalType || 'cow', // Ensure animalType is included
        count: product.count || 1 // Count field for same product configurations
      });

      console.log(`✅ Product ${productDetails.name}: Unit Price ₹${unitPrice}, Monthly Price ₹${monthlyPrice} (${productDeliveries} deliveries)`);

      // Product-specific delivery schedule is now generated above
      // No need for global allDeliveries array
    }

    // Calculate totals from the calculated products array
    const totalBasePrice = calculatedProducts.reduce((sum, product) => sum + product.unitPrice, 0);
    const totalMonthlyPrice = calculatedProducts.reduce((sum, product) => sum + product.monthlyPrice, 0);

    console.log(`💰 Total Base Price: ₹${totalBasePrice}`);
    console.log(`💰 Total Monthly Price: ₹${totalMonthlyPrice}`);
    console.log(`📊 Products Summary:`, calculatedProducts.map(p => ({
      name: p.productName,
      unitPrice: p.unitPrice,
      monthlyPrice: p.monthlyPrice,
      frequency: p.deliveryFrequency
    })));

    // Validate calculations before creating subscription
    if (calculatedProducts.length === 0) {
      return res.status(400).json({
        message: "No products calculated successfully"
      });
    }

    if (totalMonthlyPrice <= 0) {
      return res.status(400).json({
        message: "Invalid total monthly price calculated"
      });
    }

    console.log(`🎯 Final Calculation Summary:`);
    console.log(`   - Products Count: ${calculatedProducts.length}`);
    console.log(`   - Total Base Price: ₹${totalBasePrice}`);
    console.log(`   - Total Monthly Price: ₹${totalMonthlyPrice}`);
    console.log(`   - Individual Product Monthly Prices:`, calculatedProducts.map(p => `₹${p.monthlyPrice}`).join(', '));

    // Smart scheduling: if today is selected, start tomorrow
    const today = new Date();
    const selectedDate = new Date(startDate);
    const isToday = selectedDate.toDateString() === today.toDateString();
    const actualStartDate = isToday ? new Date(today.getTime() + 24 * 60 * 60 * 1000) : selectedDate;

    console.log('🔍 Smart scheduling for new subscription:', {
      selectedDate: selectedDate.toISOString(),
      isToday,
      actualStartDate: actualStartDate.toISOString()
    });

    // Create enhanced subscription
    const subscription = new Subscription({
      customer: customerId,
      branch: nearestBranch._id, // Use the branch _id directly
      slot: slot.toLowerCase(),
      startDate: actualStartDate,
      endDate: new Date(endDate),
      deliveryAddress: addressId,
      price: totalBasePrice,
      bill: totalMonthlyPrice,
      // deliveryPartner will be assigned by admin later
      // Store products array for enhanced functionality
      products: calculatedProducts,
      status: "pending", // Initial status pending payment
      paymentStatus: "pending"
    });

    // --- Fetch and Calculate Tax Details ---
    const activeTax = await Tax.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (activeTax) {
      const sgstAmount = Number((subscription.bill * (activeTax.sgst / 100)).toFixed(2));
      const cgstAmount = Number((subscription.bill * (activeTax.cgst / 100)).toFixed(2));
      subscription.sgst = sgstAmount;
      subscription.cgst = cgstAmount;
      subscription.bill = Number((subscription.bill + sgstAmount + cgstAmount).toFixed(2));
    }

    // Save subscription first to get _id values for products
    await subscription.save();

    // Generate optimized delivery schedule for multi-product subscriptions
    console.log('🔍 About to generate delivery schedule with products:', calculatedProducts.map(p => ({
      name: p.productName,
      frequency: p.deliveryFrequency,
      productId: p.productId
    })));

    const deliverySchedule = generateMultiProductDeliverySchedule(
      subscription.products, // Use saved products with _id values
      actualStartDate,
      new Date(endDate),
      slot.toLowerCase()
    );

    console.log('🔍 Generated delivery schedule:', {
      totalDeliveries: deliverySchedule.totalDeliveries,
      deliveriesCount: deliverySchedule.deliveries.length,
      firstDelivery: deliverySchedule.deliveries[0] ? {
        date: deliverySchedule.deliveries[0].date,
        productsCount: deliverySchedule.deliveries[0].products?.length,
        products: deliverySchedule.deliveries[0].products
      } : 'No deliveries'
    });

    subscription.deliveries = deliverySchedule.deliveries;
    subscription.totalDeliveries = deliverySchedule.totalDeliveries;
    subscription.remainingDeliveries = deliverySchedule.totalDeliveries;

    // Save subscription with delivery schedule
    console.log('🔍 About to save subscription with deliveries:', {
      deliveriesCount: subscription.deliveries.length,
      firstDelivery: subscription.deliveries[0] ? {
        date: subscription.deliveries[0].date,
        productsCount: subscription.deliveries[0].products?.length,
        firstProduct: subscription.deliveries[0].products?.[0] ? {
          name: subscription.deliveries[0].products[0].productName,
          quantityValue: subscription.deliveries[0].products[0].quantityValue,
          quantityUnit: subscription.deliveries[0].products[0].quantityUnit
        } : 'No products'
      } : 'No deliveries'
    });

    await subscription.save();

    console.log('✅ Subscription saved successfully');

    // Verify what was actually saved to database
    const savedSubscription = await Subscription.findById(subscription._id).populate('products.productId');
    console.log('🔍 Verification - What was actually saved to database:', {
      subscriptionId: savedSubscription.subscriptionId,
      productsCount: savedSubscription.products?.length,
      firstProduct: savedSubscription.products?.[0] ? {
        name: savedSubscription.products[0].productName,
        quantityValue: savedSubscription.products[0].quantityValue,
        quantityUnit: savedSubscription.products[0].quantityUnit,
        quantityType: typeof savedSubscription.products[0].quantityValue
      } : 'No products',
      deliveriesCount: savedSubscription.deliveries?.length,
      firstDelivery: savedSubscription.deliveries?.[0] ? {
        date: savedSubscription.deliveries[0].date,
        productsCount: savedSubscription.deliveries[0].products?.length,
        firstProduct: savedSubscription.deliveries[0].products?.[0] ? {
          name: savedSubscription.deliveries[0].products[0].productName,
          quantityValue: savedSubscription.deliveries[0].products[0].quantityValue,
          quantityUnit: savedSubscription.deliveries[0].products[0].quantityUnit,
          quantityType: typeof savedSubscription.deliveries[0].products[0].quantityValue
        } : 'No products'
      } : 'No deliveries'
    });

    // Update customer with subscription reference
    await Customer.findByIdAndUpdate(customerId, {
      subscription: subscription._id
    });

    const responseData = {
      success: true,
      message: "Enhanced subscription created successfully",
      subscription: {
        _id: subscription._id,
        subscriptionId: subscription.subscriptionId,
        customer: subscription.customer,
        products: subscription.products,
        branch: subscription.branch,
        slot: subscription.slot,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        deliveryAddress: subscription.deliveryAddress,
        //cancellationCutoff: 2,
        price: subscription.price,
        bill: subscription.bill,
        status: subscription.status
      },
      branch: nearestBranch ? {
        _id: nearestBranch._id,
        name: nearestBranch.name,
        address: nearestBranch.address
      } : null
      // deliveryPartner will be assigned by admin later
    };

    console.log('🔍 Returning subscription response:', {
      subscriptionId: responseData.subscription.subscriptionId,
      productsCount: responseData.subscription.products?.length,
      firstProduct: responseData.subscription.products?.[0] ? {
        name: responseData.subscription.products[0].productName,
        quantityValue: responseData.subscription.products[0].quantityValue,
        quantityUnit: responseData.subscription.products[0].quantityUnit
      } : 'No products'
    });

    return res.status(201).json(responseData);

  } catch (error) {
    console.error("Create enhanced subscription error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create enhanced subscription",
      error: error.message
    });
  }
};

// Change delivery date 


// Get subscriptions for current customer (from token)
export const getSubscriptionsByCurrentCustomer = async (req, res) => {
  try {
    // Try different possible JWT token structures
    const customerId = req.user?.id || req.user?.userId || req.user?.customerId || req.user?._id;

    if (!customerId) {
      console.log('🔍 JWT Token structure:', JSON.stringify(req.user, null, 2));
      return res.status(400).json({
        message: "Customer ID not found in token. Token structure: " + JSON.stringify(req.user)
      });
    }

    const subscriptions = await Subscription.find({
      customer: customerId,
      status: { $in: ['active', 'paused'] } // Only active and paused subscriptions
    }).populate('branch', 'name address')
      .populate('deliveryAddress', 'addressLine1 addressLine2 city state zipCode')
      .populate('deliveryPartner.partner', 'name phone')
      .populate('products.productId', 'name category description')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: subscriptions
    });

  } catch (error) {
    console.error("Get subscriptions by current customer error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get subscriptions",
      error: error.message
    });
  }
};

// Get available dates for delivery rescheduling (within 60 days or extended)
export const getAvailableRescheduleDates = async (req, res) => {
  try {
    const { subscriptionId, deliveryDate, slot, subscriptionProductId } = req.query;
    // consecutiveDays defaults to 1 if not provided (Single Reschedule)
    const consecutiveDays = parseInt(req.query.consecutiveDays) || 1;

    if (!subscriptionId || !deliveryDate || !slot) {
      return res.status(400).json({
        message: "Subscription ID, delivery date, and slot are required"
      });
    }

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Helper to get YYYY-MM-DD from a Date object (UTC safe)
    const toYMD = (dateObj) => {
      return dateObj.toISOString().split('T')[0];
    };

    // Normalize input date
    const originalYMD = toYMD(new Date(deliveryDate));
    const availableDates = [];

    // Find the LAST scheduled delivery date or End Date
    let lastDeliveryDate = new Date(subscription.endDate); // Default end
    if (subscription.deliveries && subscription.deliveries.length > 0) {
      const sortedDeliveries = [...subscription.deliveries].sort((a, b) => new Date(b.date) - new Date(a.date));
      const lastDel = sortedDeliveries[0];
      if (lastDel && new Date(lastDel.date) > lastDeliveryDate) {
        lastDeliveryDate = new Date(lastDel.date);
      }
    }

    // Determine Loop Range
    // Start: Tomorrow in UTC (Strictly prohibit rescheduling to today)
    const now = new Date();
    const todayUTC = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const tomorrowUTC = new Date(todayUTC);
    tomorrowUTC.setUTCDate(tomorrowUTC.getUTCDate() + 1);

    // End: lastDeliveryDate + 15 days
    const searchEndDate = new Date(lastDeliveryDate);
    searchEndDate.setUTCDate(searchEndDate.getUTCDate() + 15);
    searchEndDate.setUTCHours(0, 0, 0, 0);

    let iterator = new Date(tomorrowUTC);
    const MAX_DAYS = 365; // Safety cap
    let count = 0;

    // Pre-calculate busy dates map for O(1) lookup
    // Map: 'YYYY-MM-DD' -> count (number of deliveries on that day)
    const busyCounts = {};
    const productBusyDates = new Set(); // For specific product tracking

    subscription.deliveries.forEach(d => {
      if (['scheduled', 'reaching', 'awaitingCustomer'].includes(d.status)) {
        const dYMD = toYMD(new Date(d.date));
        busyCounts[dYMD] = (busyCounts[dYMD] || 0) + 1;

        // Track specific product presence
        if (subscriptionProductId && d.products) {
          const hasProduct = d.products.some(p => p.subscriptionProductId === subscriptionProductId);
          if (hasProduct) {
            productBusyDates.add(dYMD);
          }
        }
      }
    });

    // "Un-count" the delivery being moved from its original date
    // If filtering by product, we un-count only if that product is on that day
    for (let i = 0; i < consecutiveDays; i++) {
      const oldDate = new Date(deliveryDate);
      oldDate.setDate(oldDate.getDate() + i);
      const oldYMD = toYMD(oldDate);

      if (busyCounts[oldYMD]) {
        busyCounts[oldYMD]--;
      }
      if (productBusyDates.has(oldYMD)) {
        productBusyDates.delete(oldYMD); // Assume we are moving it out
      }
    }

    while (iterator <= searchEndDate && count < MAX_DAYS) {
      const checkYMD = toYMD(iterator); // Start of potential block

      // Block Check Logic
      // We need `consecutiveDays` starting from checkYMD to be ALL free.
      let isBlockFree = true;

      // Loop through N days forward
      for (let i = 0; i < consecutiveDays; i++) {
        // Use UTC calculation to avoid local DST/Timezone shifts
        const blockDate = new Date(iterator);
        blockDate.setUTCDate(blockDate.getUTCDate() + i);

        const blockYMD = toYMD(blockDate);

        if (subscriptionProductId) {
          // Item-specific mode: Date is available if THIS PRODUCT is not already there
          // ignoring general busy-ness (unless we want to enforce max 1 delivery per day per sub? 
          // User requirement imply we can have multi-product deliveries, so general busy-ness is NOT a blocker).
          if (productBusyDates.has(blockYMD)) {
            isBlockFree = false;
            break;
          }
        } else {
          // Legacy mode: Date is available if NO delivery exists (full day reschedule)
          if ((busyCounts[blockYMD] || 0) > 0) {
            isBlockFree = false;
            break;
          }
        }
      }

      if (isBlockFree) {
        // Strict Rule: Cannot reschedule to the exact same start date (no-op)
        if (checkYMD !== originalYMD) {
          availableDates.push({
            date: new Date(iterator),
            available: true,
            reason: "No conflicts"
          });
        }
      }

      // Next day using UTC
      iterator.setUTCDate(iterator.getUTCDate() + 1);
      count++;
    }

    // Sort by date
    availableDates.sort((a, b) => a.date.getTime() - b.date.getTime());

    return res.status(200).json({
      success: true,
      data: {
        originalDate: new Date(deliveryDate),
        availableDates: availableDates, // Only returning valid start dates
        unavailableDates: [], // Use empty or populate if needed
        totalAvailable: availableDates.length
      }
    });

  } catch (error) {
    console.error("Get available reschedule dates error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get available reschedule dates",
      error: error.message
    });
  }
};


/**
 * Add product to existing subscription (requires payment verification)
 * 
 * This endpoint allows customers to add any product with any quantity to their
 * existing subscription. The delivery schedule will be automatically synchronized
 * with existing deliveries based on the new product's frequency.
 * 
 * Required: paymentVerified = true (payment must be verified before calling this)
 * 
 * @route POST /subscriptions/:subscriptionId/add-product
 */
export const addProductToExistingSubscription = async (req, res) => {
  try {
    const { id: subscriptionId } = req.params; // Route uses :id
    const {
      productId,
      productName,
      animalType,
      quantityValue,
      quantityUnit,
      unitPrice,
      deliveryFrequency,
      deliveryGap,
      maxDeliveries,
      startDate,
      paymentVerified = false,
      // Payment details for storing in payment history
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentAmount
    } = req.body;
    const customerId = req.user._id;

    // Fetch active tax rates at the start
    const activeTax = await Tax.findOne({ isActive: true }).sort({ createdAt: -1 });

    console.log('🔍 addProductToExistingSubscription called with:', {
      subscriptionId,
      productId,
      productName,
      animalType,
      quantityValue,
      quantityUnit,
      unitPrice,
      deliveryFrequency,
      deliveryGap,
      maxDeliveries,
      startDate,
      paymentVerified,
      razorpayOrderId,
      razorpayPaymentId: razorpayPaymentId ? '***' : null, // Mask for security
      customerId
    });

    // Validate required fields (animalType is optional for products that don't have animal types)
    if (!subscriptionId || !productId || !productName || !quantityValue || !quantityUnit || !unitPrice || !deliveryFrequency || !maxDeliveries) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields for adding product to subscription. Required: productId, productName, quantityValue, quantityUnit, unitPrice, deliveryFrequency, maxDeliveries"
      });
    }

    // Set default deliveryGap based on frequency if not provided
    const effectiveDeliveryGap = deliveryGap || getDefaultDeliveryGap(deliveryFrequency);

    // Set default animalType for products that don't have animal types
    const effectiveAnimalType = animalType || 'default';

    // Find the subscription and verify ownership FIRST
    let subscription = await Subscription.findOne({
      _id: subscriptionId,
      customer: customerId
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found or you don't have permission to access it"
      });
    }

    // Check if subscription status allows adding products
    if (!['active', 'paused'].includes(subscription.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot add products to subscription with status: ${subscription.status}`
      });
    }

    // NOW check payment method based on subscription's existing payment method
    const subscriptionPaymentMethod = subscription.paymentDetails?.paymentMethod || 'online';
    const isCodSubscription = subscriptionPaymentMethod === 'cod';

    console.log('💳 Subscription payment method:', subscriptionPaymentMethod);

    // For online subscriptions, payment details are required
    if (!isCodSubscription) {
      if (!razorpayOrderId || !razorpayPaymentId) {
        return res.status(400).json({
          success: false,
          message: "Payment details (razorpayOrderId, razorpayPaymentId) are required for online subscriptions"
        });
      }

      // Ensure payment was verified for online subscriptions
      if (!paymentVerified) {
        return res.status(400).json({
          success: false,
          message: "Payment verification required before adding products to online subscriptions"
        });
      }
    } else {
      console.log('✅ Skipping payment verification for COD subscription');
    }

    // NOTE: We allow adding the same product with same quantity multiple times
    // Each product addition gets a unique subscriptionProductId for tracking
    // This is useful when a customer wants to add more of the same product
    // (e.g., another 500ml milk subscription for a family member)

    // Smart scheduling: if today is selected, start tomorrow
    const today = new Date();
    const selectedDate = new Date(startDate);
    const isToday = selectedDate.toDateString() === today.toDateString();
    const actualStartDate = isToday ? new Date(today.getTime() + 24 * 60 * 60 * 1000) : selectedDate;

    // ⭐ SMART DELIVERY CALCULATION: Calculate actual deliveries based on remaining subscription days
    const subscriptionEndDate = new Date(subscription.endDate);
    const daysRemaining = Math.ceil((subscriptionEndDate - actualStartDate) / (1000 * 60 * 60 * 24));

    // Calculate actual deliveries based on frequency and remaining days
    let actualDeliveries;
    switch (deliveryFrequency) {
      case 'daily':
        actualDeliveries = Math.min(maxDeliveries, Math.max(0, daysRemaining));
        break;
      case 'alternate':
        actualDeliveries = Math.min(maxDeliveries, Math.max(0, Math.floor(daysRemaining / 2)));
        break;
      case 'weekly':
        actualDeliveries = Math.min(maxDeliveries, Math.max(0, Math.floor(daysRemaining / 7)));
        break;
      case 'monthly':
        actualDeliveries = Math.min(maxDeliveries, Math.max(0, Math.floor(daysRemaining / 30)));
        break;
      default:
        actualDeliveries = Math.min(maxDeliveries, daysRemaining);
    }

    // Ensure at least 1 delivery if there's time remaining
    if (daysRemaining > 0 && actualDeliveries === 0) {
      actualDeliveries = 1;
    }

    console.log('📅 Smart delivery calculation:', {
      subscriptionEndDate: subscriptionEndDate.toISOString(),
      actualStartDate: actualStartDate.toISOString(),
      daysRemaining,
      requestedDeliveries: maxDeliveries,
      actualDeliveries,
      deliveryFrequency
    });

    // If no deliveries possible (subscription already ended), reject
    if (actualDeliveries <= 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot add product: subscription has no remaining delivery days. Please renew your subscription first."
      });
    }

    // Calculate pricing based on ACTUAL deliveries, not requested
    const actualMonthlyPrice = unitPrice * actualDeliveries;

    // Generate unique subscription product ID for the new product
    const subscriptionProductId = await generateSubscriptionProductId();

    // Create new product entry with actual deliveries
    const newProduct = {
      subscriptionProductId: subscriptionProductId,
      productId: productId,
      productName: productName,
      animalType: effectiveAnimalType,
      quantityValue: quantityValue,
      quantityUnit: quantityUnit,
      unitPrice: unitPrice,
      monthlyPrice: actualMonthlyPrice,
      deliveryFrequency: deliveryFrequency,
      deliveryGap: effectiveDeliveryGap,
      maxDeliveries: actualDeliveries, // Use actual deliveries
      totalDeliveries: actualDeliveries,
      deliveredCount: 0,
      remainingDeliveries: actualDeliveries
    };

    // Add product to subscription
    subscription.products.push(newProduct);

    // Update subscription pricing
    const totalMonthlyPrice = subscription.products.reduce((sum, product) => sum + product.monthlyPrice, 0);
    subscription.price = totalMonthlyPrice;
    subscription.bill = totalMonthlyPrice;

    // Recalculate taxes for the new total bill
    if (activeTax) {
      const sgstAmount = Number((subscription.bill * (activeTax.sgst / 100)).toFixed(2));
      const cgstAmount = Number((subscription.bill * (activeTax.cgst / 100)).toFixed(2));
      subscription.sgst = sgstAmount;
      subscription.cgst = cgstAmount;
      subscription.bill = Number((subscription.bill + sgstAmount + cgstAmount).toFixed(2));
    }

    console.log('🔍 Smart scheduling:', {
      selectedDate: selectedDate.toISOString(),
      isToday,
      actualStartDate: actualStartDate.toISOString(),
      actualDeliveries,
      actualMonthlyPrice
    });

    // Use the unique subscriptionProductId we just generated
    const productInfo = {
      subscriptionProductId: subscriptionProductId, // ✅ USE UNIQUE SUBSCRIPTION PRODUCT ID
      productId: productId,
      productName: productName,
      animalType: effectiveAnimalType,
      quantityValue: quantityValue,
      quantityUnit: quantityUnit,
      unitPrice: unitPrice,
      deliveryFrequency: deliveryFrequency,
    };

    const newDeliveries = generateProductDeliverySchedule(
      actualStartDate,
      subscription.slot,
      deliveryFrequency,
      effectiveDeliveryGap,
      actualDeliveries, // Use actual deliveries, not maxDeliveries
      subscription.endDate,
      productInfo
    );

    // Intelligent delivery date synchronization
    console.log('🔍 Synchronizing delivery dates...');
    const synchronizedDeliveries = synchronizeDeliveryDates(subscription.deliveries, newDeliveries);
    subscription.deliveries = synchronizedDeliveries;

    // Update delivery counts
    subscription.totalDeliveries = subscription.deliveries.length;
    subscription.remainingDeliveries = subscription.deliveries.filter(d => d.status === 'scheduled').length;

    // Create payment history record for this product addition\n    // (Using subscriptionPaymentMethod and isCodSubscription from earlier)

    const paymentRecord = {
      subscriptionProductId: subscriptionProductId,
      productId: productId,
      productName: productName,
      quantityValue: quantityValue,
      quantityUnit: quantityUnit,
      amount: paymentAmount || (unitPrice * actualDeliveries), // Total payment amount based on actual deliveries
      currency: 'INR',
      paymentMethod: subscriptionPaymentMethod, // Inherit payment method from subscription
      createdAt: new Date(),
      ...(isCodSubscription ? {
        // COD payment - omit Razorpay details, use 'cod' status
        status: 'cod',
        verifiedAt: new Date() // Mark as confirmed at creation for COD
      } : {
        // Online payment - include Razorpay details
        razorpayOrderId: razorpayOrderId,
        razorpayPaymentId: razorpayPaymentId,
        razorpaySignature: razorpaySignature || '',
        status: 'verified',
        verifiedAt: new Date()
      })
    };

    console.log('💳 Creating payment history record:', {
      subscriptionProductId: paymentRecord.subscriptionProductId,
      productName: paymentRecord.productName,
      amount: paymentRecord.amount,
      razorpayOrderId: paymentRecord.razorpayOrderId
    });

    // Use atomic update to avoid version conflicts
    try {
      const updatedSubscription = await Subscription.findByIdAndUpdate(
        subscriptionId,
        {
          $push: {
            products: newProduct,
            productPaymentHistory: paymentRecord
          },
          $set: {
            price: totalMonthlyPrice,
            bill: subscription.bill, // Use the updated bill with taxes
            sgst: subscription.sgst,
            cgst: subscription.cgst,
            deliveries: synchronizedDeliveries,
            totalDeliveries: synchronizedDeliveries.length,
            remainingDeliveries: synchronizedDeliveries.filter(d => d.status === 'scheduled').length
          }
        },
        { new: true, runValidators: true }
      );

      if (!updatedSubscription) {
        throw new Error('Failed to update subscription');
      }

      // Update the local subscription object for response
      subscription = updatedSubscription;
    } catch (error) {
      console.error('❌ Error updating subscription atomically:', error);
      // Fallback to regular save with retry mechanism
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          await subscription.save();
          break; // Success, exit retry loop
        } catch (saveError) {
          if (saveError.name === 'VersionError' && retryCount < maxRetries - 1) {
            console.log(`🔄 Version conflict detected, retrying... (attempt ${retryCount + 1}/${maxRetries})`);
            // Re-fetch the subscription to get the latest version
            const freshSubscription = await Subscription.findById(subscriptionId);
            if (freshSubscription) {
              // Re-apply the changes to the fresh subscription
              freshSubscription.products.push(newProduct);
              freshSubscription.productPaymentHistory.push(paymentRecord); // Also add payment history
              freshSubscription.price = totalMonthlyPrice;
              freshSubscription.bill = subscription.bill; // Sync with previously calculated bill
              freshSubscription.sgst = subscription.sgst;
              freshSubscription.cgst = subscription.cgst;
              freshSubscription.deliveries = synchronizedDeliveries;
              freshSubscription.totalDeliveries = synchronizedDeliveries.length;
              freshSubscription.remainingDeliveries = synchronizedDeliveries.filter(d => d.status === 'scheduled').length;
              subscription = freshSubscription;
              retryCount++;
            } else {
              throw new Error('Subscription not found during retry');
            }
          } else {
            throw saveError; // Re-throw if not a version error or max retries reached
          }
        }
      }
    }

    console.log('✅ Product added to subscription successfully');
    console.log(`   - Product: ${productName}`);
    console.log(`   - Actual Deliveries: ${actualDeliveries}`);
    console.log(`   - Product Price: ₹${actualMonthlyPrice}`);
    console.log(`   - Total Subscription Price: ₹${totalMonthlyPrice}`);
    console.log(`   - New Delivery Dates: ${newDeliveries.length}`);
    console.log(`   - Total Delivery Dates: ${synchronizedDeliveries.length}`);
    console.log(`   - Payment Record Created: ${paymentRecord.razorpayPaymentId}`);

    return res.status(200).json({
      success: true,
      message: "Product added to subscription successfully",
      data: {
        subscription: {
          _id: subscription._id,
          subscriptionId: subscription.subscriptionId,
          products: subscription.products,
          price: subscription.price,
          bill: subscription.bill,
          totalDeliveries: subscription.totalDeliveries,
          remainingDeliveries: subscription.remainingDeliveries,
          slot: subscription.slot,
          deliveryAddress: subscription.deliveryAddress
        },
        addedProduct: {
          subscriptionProductId: subscriptionProductId,
          productId: productId,
          productName: productName,
          quantityValue: quantityValue,
          quantityUnit: quantityUnit,
          monthlyPrice: actualMonthlyPrice,
          deliveryFrequency: deliveryFrequency,
          maxDeliveries: maxDeliveries,
          startDate: actualStartDate,
          isTodaySelected: isToday
        },
        paymentDetails: {
          recorded: true,
          razorpayOrderId: paymentRecord.razorpayOrderId,
          razorpayPaymentId: paymentRecord.razorpayPaymentId,
          amount: paymentRecord.amount,
          verifiedAt: paymentRecord.verifiedAt
        },
        totalMonthlyPrice: subscription.price
      }
    });

  } catch (error) {
    console.error('❌ Error adding product to subscription with payment:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to add product to subscription",
      error: error.message
    });
  }
};

// Helper function to get default delivery gap based on frequency
function getDefaultDeliveryGap(deliveryFrequency) {
  switch (deliveryFrequency) {
    case 'daily':
      return 1;
    case 'alternate':
      return 2;
    case 'weekly':
      return 7;
    case 'monthly':
      return 30;
    default:
      return 1; // Default to daily if unknown
  }
}

// Helper function to calculate monthly price
function calculateMonthlyPrice(unitPrice, deliveryFrequency, deliveryGap, maxDeliveries) {
  let deliveriesPerMonth;

  switch (deliveryFrequency) {
    case 'daily':
      deliveriesPerMonth = 30;
      break;
    case 'alternate':
      deliveriesPerMonth = 15;
      break;
    case 'weekly':
      deliveriesPerMonth = 4;
      break;
    case 'monthly':
      deliveriesPerMonth = 1;
      break;
    default:
      deliveriesPerMonth = 30;
  }

  return unitPrice * deliveriesPerMonth;
}

// Helper function to generate delivery schedule for a specific product
function generateProductDeliverySchedule(startDate, slot, deliveryFrequency, deliveryGap, maxDeliveries, subscriptionEndDate, productInfo = null) {
  const deliveries = [];
  const currentDate = new Date(startDate);
  const endDate = new Date(subscriptionEndDate);

  let deliveryCount = 0;

  while (currentDate <= endDate && deliveryCount < maxDeliveries) {
    // Calculate cutoff time (2 hours before delivery slot)
    const cutoffTime = new Date(currentDate);
    if (slot.toLowerCase() === 'morning') {
      cutoffTime.setHours(4, 0, 0, 0);
    } else {
      cutoffTime.setHours(16, 0, 0, 0);
    }

    deliveries.push({
      date: new Date(currentDate),
      slot: slot.toLowerCase(),
      status: "scheduled",
      cutoffTime: cutoffTime,
      products: productInfo ? [{
        productId: productInfo.productId,
        productName: productInfo.productName,
        animalType: productInfo.animalType,
        quantityValue: productInfo.quantityValue,
        quantityUnit: productInfo.quantityUnit,
        unitPrice: productInfo.unitPrice,
        deliveryFrequency: deliveryFrequency, // Include delivery frequency
        subscriptionProductId: productInfo.subscriptionProductId, // Add subscription product ID
        deliveryStatus: "pending"
      }] : [{
        productId: null, // Will be set when product is added
        deliveryStatus: "pending"
      }]
    });

    // Move to next delivery date based on frequency
    switch (deliveryFrequency) {
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
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
      default:
        currentDate.setDate(currentDate.getDate() + deliveryGap);
    }

    deliveryCount++;
  }

  return deliveries;
}

// Intelligent delivery date synchronization function
export const synchronizeDeliveryDates = (existingDeliveries, newDeliveries, newProductFrequency, slot) => {
  console.log('🔄 Synchronizing delivery dates...');
  console.log('📅 Existing deliveries:', existingDeliveries.length);
  console.log('📅 New deliveries:', newDeliveries.length);
  console.log('📅 New product frequency:', newProductFrequency);

  // Group existing deliveries by date
  const deliveriesByDate = {};
  existingDeliveries.forEach(delivery => {
    const dateKey = new Date(delivery.date).toDateString();
    if (!deliveriesByDate[dateKey]) {
      deliveriesByDate[dateKey] = [];
    }
    deliveriesByDate[dateKey].push(delivery);
  });

  // Process new deliveries and try to sync with existing ones
  const synchronizedDeliveries = [...existingDeliveries];
  const processedNewDeliveries = [];

  newDeliveries.forEach(newDelivery => {
    const newDeliveryDate = new Date(newDelivery.date);
    const dateKey = newDeliveryDate.toDateString();

    // Check if there's already a delivery on this date
    if (deliveriesByDate[dateKey]) {
      // Find the existing delivery for this date
      const existingDelivery = deliveriesByDate[dateKey][0];

      // Add the new product to the existing delivery
      if (!existingDelivery.products) {
        existingDelivery.products = [];
      }

      // Add the new product to the existing delivery
      if (newDelivery.products && newDelivery.products.length > 0) {
        const newProduct = newDelivery.products[0];
        existingDelivery.products.push({
          productId: newProduct.productId,
          productName: newProduct.productName,
          animalType: newProduct.animalType,
          quantityValue: newProduct.quantityValue,
          quantityUnit: newProduct.quantityUnit,
          unitPrice: newProduct.unitPrice,
          deliveryFrequency: newProduct.deliveryFrequency,
          subscriptionProductId: newProduct.subscriptionProductId, // Add subscription product ID
          deliveryStatus: 'pending'
        });
      }

      console.log(`✅ Synced new product with existing delivery on ${dateKey}`);
    } else {
      // No existing delivery on this date, add as new delivery
      processedNewDeliveries.push(newDelivery);
      deliveriesByDate[dateKey] = [newDelivery];
    }
  });

  // Add the new standalone deliveries
  synchronizedDeliveries.push(...processedNewDeliveries);

  // Sort all deliveries by date
  synchronizedDeliveries.sort((a, b) => new Date(a.date) - new Date(b.date));

  console.log('✅ Delivery synchronization complete');
  console.log('📅 Total synchronized deliveries:', synchronizedDeliveries.length);
  console.log('📅 New standalone deliveries added:', processedNewDeliveries.length);

  return synchronizedDeliveries;
};


export const getSubscriptionDirections = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { origin, destination, routeType, updateOrder = false } = req.body;

    console.log("🗺️ Subscription directions requested:", { subscriptionId, routeType });

    if (!origin || !destination) {
      return res.status(400).json({ message: "Origin and destination coordinates are required" });
    }

    // Find the subscription
    const subscription = await Subscription.findById(subscriptionId)
      .populate("customer", "name phone email")
      .populate("branch", "name address")
      .populate("deliveryPartner.partner", "name phone")
      .populate("deliveryAddress", "addressLine1 city state zipCode latitude longitude");

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Find the specific delivery for today's date
    const today = new Date();
    const delivery = subscription.deliveries.find(d =>
      d.date.toDateString() === today.toDateString()
    );

    if (!delivery) {
      return res.status(404).json({ message: "No delivery found for today" });
    }

    // Get directions from Google Maps
    const routeData = await googleMapsService.getDirections(origin, destination, {
      mode: 'driving',
      traffic: true,
      alternatives: false
    });

    // Add metadata to route data
    const enhancedRouteData = {
      ...routeData,
      routeType: routeType || 'partner-to-customer',
      origin: {
        latitude: origin.latitude,
        longitude: origin.longitude,
        address: origin.address || 'Origin location'
      },
      destination: {
        latitude: destination.latitude,
        longitude: destination.longitude,
        address: destination.address || 'Destination location'
      },
      subscriptionId: subscriptionId,
      deliveryDate: today.toISOString(),
      isActive: delivery.status === 'reaching'
    };

    console.log("✅ Subscription directions fetched successfully:", {
      distance: routeData.distance?.text,
      duration: routeData.duration?.text,
      coordinates: routeData.coordinates?.length
    });

    return res.status(200).json({
      message: "Subscription directions fetched successfully",
      routeData: enhancedRouteData
    });

  } catch (error) {
    console.error("❌ Get subscription directions error:", error);
    return res.status(500).json({
      message: "Failed to fetch subscription directions",
      error: error.message
    });
  }
};

// Geocode address for subscription delivery
export const geocodeSubscriptionAddress = async (req, res) => {
  try {
    const { address } = req.body;

    if (!address || typeof address !== 'string' || address.trim().length < 3) {
      return res.status(400).json({
        message: "Valid address string is required (minimum 3 characters)",
        success: false
      });
    }

    const cleanAddress = address.trim();
    console.log('🗺️ Subscription geocoding request:', cleanAddress);

    // Use the shared Google Maps service
    const coordinates = await googleMapsService.geocodeAddress(cleanAddress);

    console.log('✅ Subscription geocoding result:', coordinates);
    return res.status(200).json({
      success: true,
      coordinates,
      address: cleanAddress,
      method: 'google_maps',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Subscription geocoding error:', error.message);

    // Determine if this is a temporary error (quota, timeout) or permanent (invalid address)
    const isTemporaryError = error.message.includes('quota') ||
      error.message.includes('timeout') ||
      error.message.includes('unavailable') ||
      error.message.includes('temporarily');

    if (isTemporaryError) {
      // For temporary errors, return service unavailable
      return res.status(503).json({
        success: false,
        message: "Geocoding service temporarily unavailable",
        error: error.message,
        retryAfter: 60 // seconds
      });
    }

    // For permanent errors (invalid address), try fallback geocoding
    console.log('⚠️ Falling back to keyword-based geocoding');

    let coordinates = null;
    let confidence = 'low';
    const addressLower = address.toLowerCase();

    // Major US cities with high confidence
    if (addressLower.includes('san francisco') && addressLower.includes('california')) {
      coordinates = { latitude: 37.7749, longitude: -122.4194 };
      confidence = 'high';
    } else if (addressLower.includes('new york') || (addressLower.includes('nyc') && addressLower.includes('ny'))) {
      coordinates = { latitude: 40.7128, longitude: -74.0060 };
      confidence = 'high';
    } else if (addressLower.includes('los angeles') || addressLower.includes('la california')) {
      coordinates = { latitude: 34.0522, longitude: -118.2437 };
      confidence = 'high';
    } else if (addressLower.includes('chicago') && addressLower.includes('illinois')) {
      coordinates = { latitude: 41.8781, longitude: -87.6298 };
      confidence = 'high';
    } else if (addressLower.includes('miami') && addressLower.includes('florida')) {
      coordinates = { latitude: 25.7617, longitude: -80.1918 };
      confidence = 'high';
    } else if (addressLower.includes('seattle') && addressLower.includes('washington')) {
      coordinates = { latitude: 47.6062, longitude: -122.3321 };
      confidence = 'high';
    } else if (addressLower.includes('boston') && addressLower.includes('massachusetts')) {
      coordinates = { latitude: 42.3601, longitude: -71.0589 };
      confidence = 'high';
    } else if (addressLower.includes('austin') && addressLower.includes('texas')) {
      coordinates = { latitude: 30.2672, longitude: -97.7431 };
      confidence = 'high';
    } else if (addressLower.includes('denver') && addressLower.includes('colorado')) {
      coordinates = { latitude: 39.7392, longitude: -104.9903 };
      confidence = 'high';
    }
    // State-level fallbacks with medium confidence
    else if (addressLower.includes('california') || addressLower.includes('ca')) {
      coordinates = { latitude: 36.7783, longitude: -119.4179 }; // California center
      confidence = 'medium';
    } else if (addressLower.includes('new york') || addressLower.includes('ny')) {
      coordinates = { latitude: 40.7128, longitude: -74.0060 }; // NYC
      confidence = 'medium';
    } else if (addressLower.includes('florida') || addressLower.includes('fl')) {
      coordinates = { latitude: 27.9944, longitude: -81.7603 }; // Florida center
      confidence = 'medium';
    } else if (addressLower.includes('texas') || addressLower.includes('tx')) {
      coordinates = { latitude: 31.9686, longitude: -99.9018 }; // Texas center
      confidence = 'medium';
    } else {
      // Geographic center of contiguous United States as final fallback
      coordinates = { latitude: 39.8283, longitude: -98.5795 };
      confidence = 'low';
    }

    console.log(`📍 Using fallback coordinates (${confidence} confidence):`, coordinates);
    return res.status(200).json({
      success: true,
      coordinates,
      address: address,
      method: 'fallback',
      confidence: confidence,
      fallback: true,
      timestamp: new Date().toISOString(),
      note: 'Address geocoding failed - using approximate location based on city/state'
    });
  }
};

// Reschedule a specific product within a subscription
export const rescheduleSubscriptionItem = async (req, res) => {
  try {
    const { id: subscriptionId } = req.params;
    const { subscriptionProductId, currentDate, newDate } = req.body;

    if (!subscriptionId || !subscriptionProductId || !currentDate || !newDate) {
      return res.status(400).json({ message: "Subscription ID, product ID, current date, and new date are required" });
    }

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Normalize dates
    const currentD = new Date(currentDate);
    const newD = new Date(newDate);

    // Find source delivery
    const sourceDeliveryIndex = subscription.deliveries.findIndex(d =>
      new Date(d.date).toDateString() === currentD.toDateString()
    );

    if (sourceDeliveryIndex === -1) {
      return res.status(404).json({ message: "Source delivery not found" });
    }

    const sourceDelivery = subscription.deliveries[sourceDeliveryIndex];

    // Find product in source delivery
    // Note: subscriptionProductId is unique string ID
    const productIndex = sourceDelivery.products.findIndex(p =>
      p.subscriptionProductId === subscriptionProductId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in source delivery" });
    }

    const productToMove = sourceDelivery.products[productIndex];

    // Remove product from source
    sourceDelivery.products.splice(productIndex, 1);

    // If source delivery is now empty, remove it from the database entirely
    // This makes the date available for future rescheduling
    if (sourceDelivery.products.length === 0) {
      console.log(`📅 Removing empty delivery for ${sourceDelivery.date} from database`);
      subscription.deliveries.splice(sourceDeliveryIndex, 1);
    }

    // Find or create target delivery
    let targetDelivery = subscription.deliveries.find(d =>
      new Date(d.date).toDateString() === newD.toDateString()
    );

    if (targetDelivery) {
      // Check if product already exists in target (prevent duplicates)
      const exists = targetDelivery.products.some(p => p.subscriptionProductId === subscriptionProductId);
      if (exists) {
        return res.status(400).json({ message: "Product already scheduled for this date" });
      }

      // Add to target
      targetDelivery.products.push(productToMove);

      // Reactivate target if it was canceled
      if (['canceled', 'skipped', 'noResponse'].includes(targetDelivery.status)) {
        targetDelivery.status = 'scheduled';
        targetDelivery.canceledAt = undefined;
      }
    } else {
      // Create new delivery
      const cutoffTime = new Date(newD);
      if (subscription.slot === 'morning') {
        cutoffTime.setHours(4, 0, 0, 0);
      } else {
        cutoffTime.setHours(16, 0, 0, 0);
      }

      subscription.deliveries.push({
        date: newD,
        slot: subscription.slot,
        status: 'scheduled',
        cutoffTime: cutoffTime,
        products: [productToMove],
        deliveryPartnerId: sourceDelivery.deliveryPartnerId
      });

      // Sort deliveries
      subscription.deliveries.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // Extend subscription end date if needed
    if (newD > subscription.endDate) {
      subscription.endDate = newD;
    }

    await subscription.save();

    return res.status(200).json({
      message: "Item rescheduled successfully",
      subscription
    });

  } catch (error) {
    console.error("Reschedule item error:", error);
    return res.status(500).json({ message: error.message });
  }
};
