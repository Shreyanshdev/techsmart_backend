import { Customer, DeliveryPartner } from "../../models/user.js";
import Branch from "../../models/branch.js";
import Order from "../../models/order.js";
import Address from "../../models/address.js";
import Tax from "../../models/tax.js";
import Inventory from "../../models/inventory.js";
import { Coupon } from "../../models/coupon.js";
import { googleMapsService } from '../../services/googleMapsService.js';
import {
  validateObjectId,
  validatePositiveNumber,
  validateNonNegativeNumber,
  validateNonEmptyArray,
  validateRequiredFields
} from '../../utils/validators.js';

// --- MAIN CREATE ORDER LOGIC ---
// Updated for new inventory-based schema with transactional safety
export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, items, branchId, totalPrice, addressId, deliveryFee, couponCode, couponDiscount } = req.body;

    // ===== INPUT VALIDATION =====
    try {
      validateRequiredFields(req.body, ['userId', 'items', 'branchId', 'totalPrice', 'deliveryFee']);

      // Validate ObjectIds
      validateObjectId(userId, 'User ID');
      validateObjectId(branchId, 'Branch ID');
      if (addressId) {
        validateObjectId(addressId, 'Address ID');
      }

      // Validate items array
      validateNonEmptyArray(items, 'Items');

      // Validate each item - expects inventoryId and quantity
      items.forEach((item, index) => {
        if (!item.inventoryId || item.quantity === undefined) {
          throw new Error(`Item at index ${index} is missing required fields (inventoryId, quantity)`);
        }
        validateObjectId(item.inventoryId, `Item ${index} inventory ID`);

        const qty = validatePositiveNumber(item.quantity, `Item ${index} quantity`);
        if (!Number.isInteger(qty)) {
          throw new Error(`Item ${index} quantity must be an integer`);
        }
      });

      // Validate prices
      validatePositiveNumber(totalPrice, 'Total price');
      validateNonNegativeNumber(deliveryFee, 'Delivery fee');

      if (totalPrice > 1000000) {
        throw new Error('Total price exceeds maximum allowed value');
      }

    } catch (validationError) {
      return res.status(400).json({
        message: validationError.message,
        error: 'VALIDATION_ERROR'
      });
    }
    // ===== END VALIDATION =====

    const customerData = await Customer.findById(userId);
    if (!customerData) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Get branch data
    const branchData = await Branch.findById(branchId);
    if (!branchData) {
      return res.status(404).json({ message: "Branch not found" });
    }

    // Get pickup location from branch (supports both GeoJSON and legacy format)
    const pickupData = {
      latitude: branchData.lat || branchData.location?.latitude,
      longitude: branchData.lng || branchData.location?.longitude,
      address: branchData.address || branchData.name || "Not provided"
    };

    // Validate stock and price (Hard Check) - inside transaction
    const orderItems = [];
    const stockIssues = [];

    for (const item of items) {
      // Find AND lock or at least check fresh stock within session
      const inv = await Inventory.findById(item.inventoryId)
        .populate('product', 'name brand images tags')
        .session(session);

      if (!inv) {
        stockIssues.push({ name: 'Unknown', status: 'NOT_FOUND' });
        continue;
      }

      if (!inv.isAvailable || inv.stock <= 0) {
        stockIssues.push({ name: inv.product?.name, status: 'OUT_OF_STOCK' });
        continue;
      }

      const requestedQty = item.quantity;
      const availableStock = inv.stock;
      const maxQtyLimit = inv.variant?.maxQtyPerOrder || 0;

      if (availableStock < requestedQty) {
        stockIssues.push({
          name: inv.product?.name,
          status: 'INSUFFICIENT_STOCK',
          available: availableStock
        });
        continue;
      }

      if (maxQtyLimit > 0 && requestedQty > maxQtyLimit) {
        stockIssues.push({
          name: inv.product?.name,
          status: 'LIMIT_EXCEEDED',
          message: `Maximum ${maxQtyLimit} items allowed`
        });
        continue;
      }

      // Build order item with denormalized data
      orderItems.push({
        inventory: inv._id,
        productId: inv.product?._id,
        productName: inv.product?.name || 'Unknown Product',
        productImage: inv.variant?.images?.[0] || inv.product?.images?.[0] || '',
        variantSku: inv.variant.sku,
        packSize: inv.variant.packSize,
        handling: inv.variant.handling || { fragile: false, cold: false, heavy: false },
        deliveryInstructions: [],
        quantity: requestedQty,
        unitPrice: inv.pricing.sellingPrice,
        unitMrp: inv.pricing.mrp,
        totalPrice: inv.pricing.sellingPrice * requestedQty
      });
    }

    if (stockIssues.length > 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({
        success: false,
        error: 'STOCK_CHANGED',
        message: 'Some items in your cart have updated availability',
        issues: stockIssues
      });
    }

    // --- Get address ---
    let addressData = null;
    if (addressId) {
      addressData = await Address.findById(addressId);
    }
    if (!addressData) {
      addressData = await Address.findOne({ userId, isDefault: true });
    }
    if (!addressData) {
      return res.status(404).json({ message: "Delivery address not found" });
    }

    const deliveryAddress = [
      addressData.addressLine1,
      addressData.addressLine2,
      addressData.city,
      addressData.state,
      addressData.zipCode
    ].filter(Boolean).join(', ');

    const latitude = addressData.latitude ?? 0.0;
    const longitude = addressData.longitude ?? 0.0;

    console.log('🔍 Creating order with inventory items:', orderItems.map(item => ({
      inventoryId: item.inventory,
      productName: item.productName,
      quantity: item.quantity
    })));

    const newOrder = new Order({
      customer: userId,
      items: orderItems,
      branch: branchId,
      totalPrice,
      deliveryLocation: {
        latitude,
        longitude,
        address: deliveryAddress,
        addressLine1: addressData.addressLine1,
        addressLine2: addressData.addressLine2,
        city: addressData.city,
        state: addressData.state,
        zipCode: addressData.zipCode,
        receiverName: addressData.receiverName,
        receiverPhone: addressData.receiverPhone,
        directions: addressData.directions,
      },
      pickupLocation: pickupData,
      deliveryFee: deliveryFee,
      deliveryPersonLocation: {
        latitude: 0.0,
        longitude: 0.0,
        address: "Not assigned",
      },
      couponCode: couponCode || null,
      couponDiscount: couponDiscount || 0
    });

    // --- Fetch and Calculate Tax Details ---
    const activeTax = await Tax.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (activeTax) {
      const taxableBase = (totalPrice - deliveryFee) / (1 + (activeTax.sgst + activeTax.cgst) / 100);
      newOrder.sgst = Number((taxableBase * (activeTax.sgst / 100)).toFixed(2));
      newOrder.cgst = Number((taxableBase * (activeTax.cgst / 100)).toFixed(2));
    }

    const savedOrder = await newOrder.save({ session });

    // PHASE 1: Reserve stock for each item
    // Since we are in a transaction, this is atomic
    for (const item of items) {
      const updatedInv = await Inventory.findByIdAndUpdate(
        item.inventoryId,
        { $inc: { stock: -item.quantity, reservedStock: item.quantity } }, // Immediate stock deduction from "available" view
        { session, new: true }
      );

      if (!updatedInv || updatedInv.stock < 0) {
        throw new Error(`Concurrency error: Stock depleted for ${item.inventoryId}`);
      }
    }

    await session.commitTransaction();
    session.endSession();

    // Populate for socket and response
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate('customer', 'name phone address')
      .populate('branch', 'name address city')
      .populate('items.inventory');

    // Emit event to delivery partners
    req.app.get('io').to(`branch-${branchId}`).emit('newOrderAvailable', populatedOrder);

    // Record coupon usage if applied
    if (couponCode) {
      try {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim() });
        if (coupon) {
          await coupon.recordUsage(userId);
          console.log(`🎫 Recorded usage for coupon ${couponCode} by user ${userId}`);
        }
      } catch (couponError) {
        console.error("Error recording coupon usage:", couponError);
        // Don't fail the order if coupon usage recording fails, but log it
      }
    }

    return res.status(201).json({
      message: "Order created successfully",
      order: populatedOrder
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    console.error("Create order error:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;
    const { deliveryPersonLocation } = req.body;

    const deliveryLocation = await DeliveryPartner.findById(userId);
    if (!deliveryLocation) {
      console.error("Delivery Partner not found:", userId);
      return res.status(404).json({ message: "Delivery Partner not found" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      console.error("Order not found:", orderId);
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "accepted") {
      return res.status(400).json({ message: "Order cannot be confirmed" });
    }

    order.status = "in-progress";
    order.deliveryStatus = "Partner Assigned";

    order.deliveryPartner = userId;
    order.deliveryPersonLocation = {
      latitude: deliveryPersonLocation.latitude,
      longitude: deliveryPersonLocation.longitude,
      address: deliveryPersonLocation.address || "Not provided",
    };

    req.app.get('io').to(orderId).emit("orderConfirmed", order);

    // Emit to other delivery partners in the same branch to remove this order
    req.app.get('io').to(`branch-${order.branch}`).emit('orderAcceptedByOther', order._id);

    await order.save();

    return res.status(200).json({
      message: "Order confirmed successfully",
      order: order
    });
  }
  catch (error) {
    console.error("Confirm order error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, deliveryPersonLocation, deliveryStatus } = req.body;
    const userId = req.user._id;

    const deliveryPerson = await DeliveryPartner.findById(userId);
    if (!deliveryPerson) {
      return res.status(404).json({ message: "Delivery Partner not found" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (["delivered", "cancelled"].includes(order.status)) {
      return res.status(400).json({ message: "Order cannot be updated" });
    }

    if (order.deliveryPartner.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not authorized to update this order" });
    }

    // Validate status transitions
    const validTransitions = {
      'accepted': ['in-progress'],
      'in-progress': ['awaitconfirmation'],
      'awaitconfirmation': ['delivered']
    };

    if (validTransitions[order.status] && !validTransitions[order.status].includes(status)) {
      return res.status(400).json({
        message: `Invalid status transition from ${order.status} to ${status}`
      });
    }

    // Update order status
    order.status = status;

    // Update delivery status based on new status
    switch (status) {
      case 'in-progress':
        order.deliveryStatus = 'On The Way';
        break;
      case 'awaitconfirmation':
        order.deliveryStatus = 'Delivered';
        break;
      case 'delivered':
        order.deliveryStatus = 'Delivered';
        break;
      case 'cancelled':
        order.deliveryStatus = 'Cancelled';
        order.cancelledAt = new Date();
        break;
    }

    // Update delivery person location if provided
    if (deliveryPersonLocation) {
      order.deliveryPersonLocation = deliveryPersonLocation;
    }

    order.updatedAt = new Date();
    await order.save();

    // Emit socket events for real-time updates
    req.app.get('io').to(orderId).emit("orderStatusUpdated", order);

    // Emit location updates separately for more granular control
    if (deliveryPersonLocation) {
      req.app.get('io').to(orderId).emit("orderLocationUpdated", {
        orderId: order._id,
        location: order.deliveryPersonLocation
      });
    }

    // Emit specific events based on status
    if (order.status === 'awaitconfirmation') {
      req.app.get('io').to(order.customer.toString()).emit('awaitingCustomerConfirmation', order);
    } else if (order.status === 'in-progress') {
      req.app.get('io').to(order.customer.toString()).emit('orderInProgress', order);
    } else if (order.status === 'delivered') {
      // Emit to order room
      req.app.get('io').to(orderId).emit('orderUpdated', order);

      // Close socket connections when order is delivered (with small delay)
      req.app.get('io').to(orderId).emit('orderCompleted', {
        orderId: order._id,
        status: 'delivered',
        message: 'Order delivery completed successfully'
      });

      const orderRoom = `order-${orderId}`;
      setTimeout(() => {
        req.app.get('io').socketsLeave(orderRoom);
      }, 5000);

      console.log(`✅ Order ${order.orderId} delivered via status update - socket connections closed`);
    } else if (order.status === 'cancelled') {
      // Close socket connections when order is cancelled
      req.app.get('io').to(order.customer.toString()).emit('orderCancelled', {
        orderId: order._id,
        orderNumber: order.orderId,
        message: 'Order has been cancelled'
      });

      if (order.deliveryPartner) {
        req.app.get('io').to(order.deliveryPartner.toString()).emit('orderCancelled', {
          orderId: order._id,
          orderNumber: order.orderId,
          message: 'Order has been cancelled'
        });
      }

      req.app.get('io').to(orderId).emit('orderUpdated', order);

      req.app.get('io').to(orderId).emit('orderCompleted', {
        orderId: order._id,
        status: 'cancelled',
        message: 'Order has been cancelled'
      });

      const orderRoom = `order-${orderId}`;
      setTimeout(() => {
        req.app.get('io').socketsLeave(orderRoom);
      }, 5000);

      console.log(`❌ Order ${order.orderId} cancelled via status update - socket connections closed`);
    }

    return res.status(200).json({
      message: "Order status updated successfully",
      order: order
    });
  }
  catch (error) {
    console.error("Update order status error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Get orders with optional filtering
export const getOrders = async (req, res) => {
  try {
    const { status, deliveryPartnerId, customerId, branchId } = req.query;

    let filter = {};

    // Filter by status if provided
    if (status) {
      if (typeof status === 'string' && status.includes(',')) {
        // Handle comma-separated statuses
        const statusArray = status.split(',').map(s => s.trim());
        filter.status = { $in: statusArray };
      } else if (Array.isArray(status)) {
        filter.status = { $in: status };
      } else {
        filter.status = status;
      }
    }

    // Filter by delivery partner if provided
    if (deliveryPartnerId) {
      filter.deliveryPartner = deliveryPartnerId;
    }

    // Filter by customer if provided
    if (customerId) {
      filter.customer = customerId;
    }

    // Filter by branch if provided
    if (branchId) {
      filter.branch = branchId;
    }

    console.log('Order filter:', filter); // Debug log

    const orders = await Order.find(filter)
      .populate('customer', 'name phone address')
      .populate('branch', 'name address')
      .populate('deliveryPartner', 'name phone')
      .populate('items.inventory')
      .sort({ createdAt: -1 });

    console.log(`Found ${orders.length} orders with filter:`, filter); // Debug log

    return res.status(200).json({
      message: "Orders fetched successfully",
      orders,
      total: orders.length
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//for one order
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate([
      { path: 'customer', model: 'Customer' },
      { path: 'branch', model: 'Branch' },
      { path: 'deliveryPartner', model: 'DeliveryPartner', select: 'name phone' },
      { path: 'items.inventory', model: 'Inventory' }
    ]);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({
      message: "Order fetched successfully",
      order: order
    });
  }
  catch (error) {
    console.error("Get order by ID error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete order error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Safe delete for customers (only pending orders)
export const deletePendingOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Security check: Match customer
    if (order.customer.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this order" });
    }

    // Status check: Only allow deleting pending/created orders (failed payments)
    if (!['pending', 'created'].includes(order.status) && order.paymentStatus !== 'failed') {
      return res.status(400).json({ message: "Cannot delete order in current status" });
    }

    // Release reserved stock back to inventory before deleting
    for (const item of order.items) {
      if (item.inventory) {
        const updatedInventory = await Inventory.findByIdAndUpdate(
          item.inventory,
          { $inc: { stock: item.quantity, reservedStock: -item.quantity } },
          { new: true }
        );

        // Re-enable availability if stock is now available
        if (updatedInventory && updatedInventory.stock > 0 && !updatedInventory.isAvailable) {
          await Inventory.findByIdAndUpdate(item.inventory, { isAvailable: true });
        }
      }
    }

    await Order.findByIdAndDelete(orderId);
    console.log(`🗑️ Deleted pending order ${orderId} for user ${userId} - reserved stock released`);

    return res.status(200).json({ message: "Pending order deleted successfully" });
  } catch (error) {
    console.error("Delete pending order error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyOrderHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ customer: userId }).sort({ createdAt: -1 });
    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Get my order history error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getActiveOrderForUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const activeOrder = await Order.findOne({
      customer: userId,
      status: { $in: ["pending", "accepted", "in-progress", "awaitconfirmation"] },
    }).populate('deliveryPartner', 'name');

    if (!activeOrder) {
      return res.status(404).json({ message: "No active order found" });
    }

    return res.status(200).json({ order: activeOrder });
  } catch (error) {
    console.error("Get active order error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrderTrackingInfo = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).select('status deliveryPersonLocation');

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({
      status: order.status,
      location: order.deliveryPersonLocation,
    });
  } catch (error) {
    console.error("Get order tracking info error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const confirmDeliveryReceipt = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Ensure the customer confirming is the actual customer of the order
    if (order.customer.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not authorized to confirm this delivery." });
    }

    // Only allow confirmation if the order is in 'awaitconfirmation' state
    if (order.status !== 'awaitconfirmation') {
      return res.status(400).json({ message: "Order is not awaiting customer confirmation." });
    }

    order.status = 'delivered';
    await order.save();

    // Emit final delivery confirmation events
    req.app.get('io').to(order.customer.toString()).emit('deliveryConfirmed', order);
    req.app.get('io').to(order.deliveryPartner.toString()).emit('orderStatusUpdated', order);

    // Close socket connections for this order (with delay)
    req.app.get('io').to(orderId).emit('orderUpdated', order);
    req.app.get('io').to(orderId).emit('orderCompleted', {
      orderId: order._id,
      status: 'delivered',
      message: 'Order delivery completed successfully'
    });

    // Remove clients from order-specific rooms after delay
    const orderRoom = `order-${orderId}`;
    setTimeout(() => {
      req.app.get('io').socketsLeave(orderRoom);
    }, 5000);

    console.log(`✅ Order ${order.orderId} delivery confirmed - socket connections closed`);

    return res.status(200).json({ message: "Delivery confirmed successfully", order });

  } catch (error) {
    console.error("Confirm delivery receipt error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryPartnerId } = req.body;

    if (!deliveryPartnerId) {
      return res.status(400).json({ message: "Delivery partner ID is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ message: "Order is not in pending status" });
    }

    // Check if delivery partner exists and belongs to the same branch
    const deliveryPartner = await DeliveryPartner.findById(deliveryPartnerId);
    if (!deliveryPartner) {
      return res.status(404).json({ message: "Delivery partner not found" });
    }

    if (deliveryPartner.branch.toString() !== order.branch.toString()) {
      return res.status(403).json({ message: "Delivery partner does not belong to this branch" });
    }

    // Update order status to accepted and assign delivery partner
    order.status = "accepted";
    order.deliveryPartner = deliveryPartnerId;
    order.deliveryStatus = "Partner Assigned";
    order.updatedAt = new Date();

    await order.save({ validateModifiedOnly: true });

    // Emit socket event for real-time updates
    req.app.get('io').to(`branch-${order.branch}`).emit('orderAcceptedByOther', orderId);
    req.app.get('io').to(orderId).emit('orderStatusUpdated', order);
    req.app.get('io').to(orderId).emit('orderUpdated', order);

    return res.status(200).json({
      message: "Order accepted successfully",
      order: order
    });
  } catch (error) {
    console.error("Accept order error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const pickupOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryPartnerId, pickupLocation } = req.body;

    if (!deliveryPartnerId) {
      return res.status(400).json({ message: "Delivery partner ID is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "accepted") {
      return res.status(400).json({ message: "Order must be accepted before pickup" });
    }

    if (order.deliveryPartner.toString() !== deliveryPartnerId) {
      return res.status(403).json({ message: "Only assigned delivery partner can pickup this order" });
    }

    // Update order status to in-progress (picked up from branch)
    order.status = "in-progress";
    order.deliveryStatus = "On The Way";
    order.deliveryPersonLocation = pickupLocation || {
      latitude: order.pickupLocation.latitude,
      longitude: order.pickupLocation.longitude,
      address: order.pickupLocation.address
    };
    order.updatedAt = new Date();

    await order.save({ validateModifiedOnly: true });

    // PHASE 2: Clear reserved stock (already deducted from stock in createOrder)
    for (const item of order.items) {
      if (item.inventory) {
        await Inventory.findByIdAndUpdate(
          item.inventory,
          { $inc: { reservedStock: -item.quantity } }
        );
      }
    }

    // Emit socket event for real-time updates
    req.app.get('io').to(orderId).emit('orderStatusUpdated', order);
    req.app.get('io').to(orderId).emit('orderUpdated', order);
    req.app.get('io').to(order.customer.toString()).emit('orderPickedUp', order);
    // Emit to branch room for delivery partner updates
    req.app.get('io').to(`branch-${order.branch}`).emit('orderPickedUp', {
      orderId: order._id,
      deliveryPartnerId: order.deliveryPartner,
      location: order.deliveryPersonLocation
    });

    return res.status(200).json({
      message: "Order picked up successfully",
      order: order
    });
  } catch (error) {
    console.error("Pickup order error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const markOrderAsDelivered = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryPartnerId, deliveryLocation } = req.body;

    if (!deliveryPartnerId) {
      return res.status(400).json({ message: "Delivery partner ID is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "in-progress") {
      return res.status(400).json({ message: "Order must be in-progress before marking as delivered" });
    }

    if (order.deliveryPartner.toString() !== deliveryPartnerId) {
      return res.status(403).json({ message: "Only assigned delivery partner can mark this order as delivered" });
    }

    // Update order status to awaitconfirmation (waiting for customer confirmation)
    order.status = "awaitconfirmation";
    order.deliveryStatus = "Delivered";

    // Save final delivery coordinates to database
    const finalLocation = deliveryLocation || order.deliveryPersonLocation;
    if (finalLocation) {
      order.deliveryPersonLocation = {
        ...finalLocation,
        timestamp: new Date(),
        isFinalLocation: true, // Mark this as the final delivery location
        deliveredAt: new Date()
      };
      console.log(` Final delivery location saved for order ${order.orderId}:`, finalLocation);
    }

    order.updatedAt = new Date();

    await order.save();

    // Emit socket event for real-time updates
    req.app.get('io').to(orderId).emit('orderStatusUpdated', order);
    req.app.get('io').to(orderId).emit('orderUpdated', order);
    req.app.get('io').to(order.customer.toString()).emit('awaitingCustomerConfirmation', order);

    console.log(`📦 Order ${order.orderId} marked as delivered - socket events emitted`);

    return res.status(200).json({
      message: "Order marked as delivered, waiting for customer confirmation",
      order: order
    });
  } catch (error) {
    console.error("Mark order as delivered error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get available orders for delivery partners by branch ID
export const getAvailableOrders = async (req, res) => {
  try {
    const { branchId } = req.params;

    if (!branchId) {
      return res.status(400).json({ message: "Branch ID is required" });
    }

    // Debug: Check all orders for this branch first
    const allBranchOrders = await Order.find({ branch: branchId });
    console.log(`🔍 All orders for branch ${branchId}:`, allBranchOrders.map(order => ({
      _id: order._id,
      status: order.status,
      deliveryPartner: order.deliveryPartner,
      createdAt: order.createdAt
    })));

    // Find all pending orders from this branch that are not assigned to any delivery partner
    const availableOrders = await Order.find({
      branch: branchId,
      status: 'pending',
      $or: [
        { deliveryPartner: { $exists: false } },
        { deliveryPartner: null }
      ]
    })
      .populate('customer', 'name phone address')
      .populate('branch', 'name address')
      .populate('items.inventory')
      .sort({ createdAt: -1 });


    const orders = availableOrders.map(order => {
      const orderObj = order.toObject();
      return {
        _id: orderObj._id,
        orderId: orderObj.orderId,
        status: orderObj.status,
        paymentDetails: {
          paymentMethod: orderObj.paymentDetails?.paymentMethod || 'online',
          method: orderObj.paymentDetails?.method
        },
        customer: {
          name: orderObj.customer?.name || 'Customer'
        },
        branch: {
          name: orderObj.branch?.name || 'Branch',
          address: orderObj.branch?.address || 'Address'
        },
        deliveryLocation: orderObj.deliveryLocation,
        pickupLocation: orderObj.pickupLocation,
        itemCount: orderObj.items?.reduce((sum, item) => sum + (item.quantity || item.count || 0), 0) || 0,
        totalPrice: orderObj.totalPrice,
        deliveryFee: orderObj.deliveryFee,
        createdAt: orderObj.createdAt
      };
    });


    return res.status(200).json({
      message: "Available orders fetched successfully",
      orders: orders,
      total: availableOrders.length
    });
  } catch (error) {
    console.error("Get available orders error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get current orders for a specific delivery partner
export const getCurrentOrders = async (req, res) => {
  try {
    const { deliveryPartnerId } = req.params;
    const authenticatedUserId = req.user._id.toString();

    if (!deliveryPartnerId) {
      return res.status(400).json({ message: "Delivery partner ID is required" });
    }

    // SECURITY: Verify the authenticated user is requesting their own orders
    if (deliveryPartnerId !== authenticatedUserId) {
      return res.status(403).json({
        message: "You can only view your own orders",
        error: "FORBIDDEN"
      });
    }

    // Find all orders assigned to this delivery partner with active statuses
    const currentOrders = await Order.find({
      deliveryPartner: deliveryPartnerId,
      status: { $in: ['accepted', 'in-progress', 'awaitconfirmation'] }
    })
      .populate('customer', 'name phone address')
      .populate('branch', 'name address')
      .populate('deliveryPartner', 'name phone')
      .populate('items.inventory')
      .sort({ createdAt: -1 });

    console.log(`Found ${currentOrders.length} current orders for delivery partner: ${deliveryPartnerId}`);

    // Debug: Log items structure to see if population is working
    currentOrders.forEach((order, orderIndex) => {
      console.log(`🔍 Order ${orderIndex} (${order._id}):`);
      order.items.forEach((item, itemIndex) => {
        console.log(`  Item ${itemIndex}:`, {
          id: item.id,
          itemName: item.item,
          count: item.count,
          populatedProduct: item.id ? {
            name: item.id.name,
            price: item.id.price,
            image: item.id.image
          } : 'NOT POPULATED'
        });
      });
    });

    const orders = currentOrders.map(order => {
      const orderObj = order.toObject();
      return {
        _id: orderObj._id,
        orderId: orderObj.orderId,
        status: orderObj.status,
        paymentDetails: {
          paymentMethod: orderObj.paymentDetails?.paymentMethod || 'online',
          method: orderObj.paymentDetails?.method
        },
        customer: {
          name: orderObj.customer?.name || 'Customer'
        },
        branch: {
          name: orderObj.branch?.name || 'Branch',
          address: orderObj.branch?.address || 'Address'
        },
        deliveryLocation: orderObj.deliveryLocation,
        pickupLocation: orderObj.pickupLocation,
        itemCount: orderObj.items?.reduce((sum, item) => sum + (item.quantity || item.count || 0), 0) || 0,
        totalPrice: orderObj.totalPrice,
        deliveryFee: orderObj.deliveryFee,
        createdAt: orderObj.createdAt,
        deliveryStatus: orderObj.deliveryStatus,
        deliveryPersonLocation: orderObj.deliveryPersonLocation
      };
    });

    return res.status(200).json({
      message: "Current orders fetched successfully",
      orders: orders,
      total: currentOrders.length
    });
  } catch (error) {
    console.error("Get current orders error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get order history for a specific delivery partner
export const getHistoryOrders = async (req, res) => {
  try {
    const { deliveryPartnerId } = req.params;
    const authenticatedUserId = req.user._id.toString();

    if (!deliveryPartnerId) {
      return res.status(400).json({ message: "Delivery partner ID is required" });
    }

    // SECURITY: Verify the authenticated user is requesting their own orders
    if (deliveryPartnerId !== authenticatedUserId) {
      return res.status(403).json({
        message: "You can only view your own orders",
        error: "FORBIDDEN"
      });
    }

    // Find all completed/cancelled orders for this delivery partner
    const historyOrders = await Order.find({
      deliveryPartner: deliveryPartnerId,
      status: { $in: ['delivered', 'cancelled'] }
    })
      .populate('customer', 'name phone address')
      .populate('branch', 'name address')
      .populate('deliveryPartner', 'name phone')
      .populate('items.inventory')
      .sort({ createdAt: -1 });

    console.log(`Found ${historyOrders.length} history orders for delivery partner: ${deliveryPartnerId}`);

    const orders = historyOrders.map(order => {
      const orderObj = order.toObject();
      return {
        _id: orderObj._id,
        orderId: orderObj.orderId,
        status: orderObj.status,
        paymentDetails: {
          paymentMethod: orderObj.paymentDetails?.paymentMethod || 'online',
          method: orderObj.paymentDetails?.method
        },
        paymentStatus: orderObj.paymentStatus,
        customer: {
          name: orderObj.customer?.name || 'Customer'
        },
        branch: {
          name: orderObj.branch?.name || 'Branch',
          address: orderObj.branch?.address || 'Address'
        },
        deliveryLocation: orderObj.deliveryLocation,
        pickupLocation: orderObj.pickupLocation,
        items: orderObj.items,
        itemCount: orderObj.items?.reduce((sum, item) => sum + (item.quantity || item.count || 0), 0) || 0,
        totalPrice: orderObj.totalPrice,
        deliveryFee: orderObj.deliveryFee,
        routeData: orderObj.routeData,
        createdAt: orderObj.createdAt,
        updatedAt: orderObj.updatedAt
      };
    });

    return res.status(200).json({
      message: "Order history fetched successfully",
      orders: orders,
      total: historyOrders.length
    });
  } catch (error) {
    console.error("Get history orders error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update delivery partner location in real-time with route optimization
export const updateDeliveryPartnerLocation = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryPartnerId, location, routeData } = req.body;

    if (!deliveryPartnerId || !location) {
      return res.status(400).json({ message: "Delivery partner ID and location are required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.deliveryPartner.toString() !== deliveryPartnerId) {
      return res.status(403).json({ message: "Only assigned delivery partner can update location" });
    }

    // Update order location with additional metadata
    order.deliveryPersonLocation = {
      ...location,
      timestamp: new Date(),
      accuracy: location.accuracy || 0,
      speed: location.speed || 0,
      heading: location.heading || 0
    };
    order.updatedAt = new Date();

    // Store route data if provided
    if (routeData) {
      order.routeData = {
        coordinates: routeData.coordinates || [],
        distance: routeData.distance || 0,
        duration: routeData.duration || 0,
        lastUpdated: new Date()
      };
    }

    await order.save();

    // Calculate ETA based on current location and route
    let eta = null;
    if (order.deliveryLocation && location) {
      const distance = calculateDistance(
        location.latitude, location.longitude,
        order.deliveryLocation.latitude, order.deliveryLocation.longitude
      );
      eta = Math.round(distance / 30 * 60); // Assuming 30 km/h average speed
    }

    // Emit real-time location update to customer and order room
    const deliveryUpdate = {
      orderId: order._id,
      location: location,
      eta: eta,
      routeData: order.routeData,
      timestamp: new Date()
    };

    req.app.get('io').to(order.customer.toString()).emit('deliveryPartnerLocationUpdate', deliveryUpdate);
    req.app.get('io').to(orderId).emit('deliveryPartnerLocationUpdate', deliveryUpdate);

    // Also emit for backward compatibility/simpler tracking
    req.app.get('io').to(orderId).emit('driverLocation', location);

    // Emit to branch room for other delivery partners
    req.app.get('io').to(`branch-${order.branch}`).emit('deliveryPartnerLocationUpdate', {
      orderId: order._id,
      location: location,
      eta: eta,
      routeData: order.routeData,
      timestamp: new Date()
    });

    console.log(`📍 Location updated for order ${order.orderId}:`, {
      location: location,
      eta: eta ? `${eta} minutes` : 'Unknown',
      distance: order.routeData?.distance || 'Unknown'
    });

    return res.status(200).json({
      message: "Location updated successfully",
      order: order,
      eta: eta,
      routeData: order.routeData
    });
  } catch (error) {
    console.error("Update location error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get optimized route for order delivery
export const getOptimizedRoute = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { origin, destination } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({ message: "Origin and destination coordinates are required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Calculate distance and ETA
    const distance = calculateDistance(
      origin.latitude, origin.longitude,
      destination.latitude, destination.longitude
    );

    // Estimate ETA based on distance and traffic conditions
    const baseSpeed = 30; // km/h average speed
    const trafficFactor = 1.2; // 20% slower due to traffic
    const etaMinutes = Math.round((distance / (baseSpeed / trafficFactor)) * 60);

    // Generate route coordinates (simplified - in production, use Google Directions API)
    const routeCoordinates = generateRouteCoordinates(origin, destination, 20);

    const routeData = {
      coordinates: routeCoordinates,
      distance: Math.round(distance * 1000), // in meters
      duration: etaMinutes * 60, // in seconds
      eta: etaMinutes,
      lastUpdated: new Date()
    };

    // Update order with route data
    order.routeData = routeData;
    await order.save();

    console.log(`🗺️ Route optimized for order ${order.orderId}:`, {
      distance: `${distance.toFixed(2)} km`,
      eta: `${etaMinutes} minutes`,
      coordinates: routeCoordinates.length
    });

    return res.status(200).json({
      message: "Route optimized successfully",
      routeData: routeData
    });
  } catch (error) {
    console.error("Get optimized route error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get Google Maps directions for order routes
export const getGoogleMapsDirections = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { origin, destination, routeType, updateOrder = false } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({ message: "Origin and destination coordinates are required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
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
      isActive: true
    };

    // Update order with route data if requested
    if (updateOrder) {
      // Save to route history before updating
      if (order.routeData && order.routeData.routeType) {
        order.routeHistory.push({
          routeType: order.routeData.routeType,
          coordinates: order.routeData.coordinates,
          distance: order.routeData.distance,
          duration: order.routeData.duration,
          createdAt: order.routeData.lastUpdated || new Date()
        });
      }

      // Update current route data
      order.routeData = enhancedRouteData;
      await order.save();

      console.log(`📍 Updated order ${order.orderId} with Google Maps route data:`, {
        routeType: enhancedRouteData.routeType,
        distance: enhancedRouteData.distance.text,
        duration: enhancedRouteData.duration.text
      });
    }

    return res.status(200).json({
      message: "Google Maps directions fetched successfully",
      routeData: enhancedRouteData,
      orderUpdated: updateOrder
    });
  } catch (error) {
    console.error("Get Google Maps directions error:", error);

    const { origin, destination, routeType } = req.body;

    // Check if this is a "no route found" error
    if (error.code === 'NO_ROUTE_FOUND') {
      console.log('⚠️ No route found between locations - returning user-friendly response');
      return res.status(200).json({
        message: "No route found between these locations",
        noRouteFound: true,
        suggestion: "Please use Google Maps or another navigation app for directions",
        routeData: {
          coordinates: generateRouteCoordinates(origin, destination, 10),
          distance: { text: "Route unavailable", value: 0 },
          duration: { text: "Route unavailable", value: 0 },
          routeType: routeType || 'partner-to-customer',
          origin: origin || { latitude: 0, longitude: 0 },
          destination: destination || { latitude: 0, longitude: 0 },
          lastUpdated: new Date(),
          warnings: ['No route found. Please use external navigation app.']
        },
        fallback: true,
        error: error.message
      });
    }

    // Return fallback route data for other errors
    const fallbackRoute = {
      coordinates: generateRouteCoordinates(origin, destination, 20),
      distance: { text: "Calculating...", value: 0 },
      duration: { text: "Calculating...", value: 0 },
      routeType: routeType || 'partner-to-customer',
      origin: origin || { latitude: 0, longitude: 0 },
      destination: destination || { latitude: 0, longitude: 0 },
      lastUpdated: new Date(),
      warnings: ['Using estimated route - Google Maps API unavailable']
    };

    return res.status(200).json({
      message: "Using fallback route due to API error",
      routeData: fallbackRoute,
      fallback: true,
      error: error.message
    });
  }
};

// Helper function to calculate distance between two points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

// Cancel order with proper socket cleanup
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason, cancelledBy } = req.body; // cancelledBy: 'customer' or 'delivery_partner'

    if (!reason) {
      return res.status(400).json({ message: "Cancellation reason is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ message: "Order cannot be cancelled" });
    }

    // Update order status
    order.status = 'cancelled';
    order.cancellationReason = reason;
    order.cancelledBy = cancelledBy || 'customer';
    order.cancelledAt = new Date();
    order.updatedAt = new Date();

    await order.save();

    // Release reserved stock back to inventory (only if order wasn't picked up yet)
    // If order was in-progress, stock was already deducted so add it back
    const wasPickedUp = order.deliveryStatus === 'On The Way';

    for (const item of order.items) {
      if (item.inventory) {
        if (wasPickedUp) {
          // Order was picked up - add stock back
          await Inventory.findByIdAndUpdate(item.inventory, {
            $inc: { stock: item.quantity }
          });
        } else {
          // Order wasn't picked up - just release reservation
          await Inventory.findByIdAndUpdate(item.inventory, {
            $inc: { reservedStock: -item.quantity }
          });
        }

        // Re-enable availability if needed
        const inv = await Inventory.findById(item.inventory);
        if (inv && inv.stock > 0 && !inv.isAvailable) {
          await Inventory.findByIdAndUpdate(item.inventory, { isAvailable: true });
        }
      }
    }

    // Emit cancellation events
    req.app.get('io').to(order.customer.toString()).emit('orderCancelled', {
      orderId: order._id,
      orderNumber: order.orderId,
      reason: reason,
      cancelledBy: cancelledBy,
      message: 'Order has been cancelled'
    });

    if (order.deliveryPartner) {
      req.app.get('io').to(order.deliveryPartner.toString()).emit('orderCancelled', {
        orderId: order._id,
        orderNumber: order.orderId,
        reason: reason,
        cancelledBy: cancelledBy,
        message: 'Order has been cancelled'
      });
    }

    // Close socket connections for this order
    req.app.get('io').to(orderId).emit('orderCompleted', {
      orderId: order._id,
      status: 'cancelled',
      message: 'Order has been cancelled'
    });

    // Remove clients from order-specific rooms
    const orderRoom = `order-${orderId}`;
    req.app.get('io').socketsLeave(orderRoom);

    // Emit to branch room for other delivery partners
    req.app.get('io').to(`branch-${order.branch}`).emit('orderCancelled', {
      orderId: order._id,
      orderNumber: order.orderId,
      reason: reason,
      cancelledBy: cancelledBy
    });

    console.log(`❌ Order ${order.orderId} cancelled - socket connections closed`);

    return res.status(200).json({
      message: "Order cancelled successfully",
      order: order
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get order invoice with detailed breakdown
export const getOrderInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(orderId)
      .populate('customer', 'name phone email')
      .populate('branch', 'name address phone')
      .populate('deliveryPartner', 'name phone')
      .populate('items.inventory');

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Security: Ensure customer can only view their own order invoice
    if (order.customer._id.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not authorized to view this invoice" });
    }

    // Calculate detailed line items
    const lineItems = order.items.map((item, index) => {
      const product = item.id;
      const quantity = item.count || 1;
      const unitPrice = product?.discountPrice || product?.price || 0;
      const originalPrice = product?.price || unitPrice;
      const hasDiscount = originalPrice > unitPrice;
      const itemTotal = unitPrice * quantity;
      const savings = hasDiscount ? (originalPrice - unitPrice) * quantity : 0;

      return {
        srNo: index + 1,
        productId: product?._id,
        name: item.item || product?.name || 'Product',
        unitPrice: unitPrice,
        originalPrice: originalPrice,
        hasDiscount: hasDiscount,
        discountPercent: hasDiscount ? Math.round(((originalPrice - unitPrice) / originalPrice) * 100) : 0,
        quantity: quantity,
        unit: product?.unit || product?.quantity?.unit || 'pc',
        itemTotal: itemTotal,
        savings: savings
      };
    });

    // Calculate totals
    const subtotal = lineItems.reduce((sum, item) => sum + item.itemTotal, 0);
    const totalSavings = lineItems.reduce((sum, item) => sum + item.savings, 0);
    const deliveryFee = order.deliveryFee || 0;
    const grandTotal = order.totalPrice || (subtotal + deliveryFee);

    // Payment info
    const paymentMethod = order.paymentDetails?.paymentMethod || 'online';
    const isPayOnDelivery = paymentMethod === 'cod';
    const paymentStatus = order.paymentStatus || 'pending';
    const isPaid = paymentStatus === 'verified' || paymentStatus === 'completed';

    // Build invoice response
    const invoice = {
      invoiceNumber: `INV-${order.orderId}`,
      orderNumber: order.orderId,
      orderDate: order.createdAt,
      orderStatus: order.status,

      // Customer Details
      customer: {
        name: order.customer?.name || 'Customer',
        phone: order.customer?.phone || '',
        email: order.customer?.email || ''
      },

      // Delivery Address
      deliveryAddress: {
        address: order.deliveryLocation?.address || 'Address not available',
        latitude: order.deliveryLocation?.latitude,
        longitude: order.deliveryLocation?.longitude
      },

      // Branch Details
      branch: {
        name: order.branch?.name || 'Branch',
        address: order.branch?.address || '',
        phone: order.branch?.phone || ''
      },

      // Delivery Partner (if assigned)
      deliveryPartner: order.deliveryPartner ? {
        name: order.deliveryPartner.name,
        phone: order.deliveryPartner.phone
      } : null,

      // Line Items with detailed breakdown
      lineItems: lineItems,

      // Summary
      summary: {
        subtotal: subtotal,
        totalSavings: totalSavings,
        deliveryFee: deliveryFee,
        grandTotal: grandTotal,
        itemCount: lineItems.length,
        totalQuantity: lineItems.reduce((sum, item) => sum + item.quantity, 0)
      },

      // Payment Details
      payment: {
        method: isPayOnDelivery ? 'Cash on Delivery' : 'Online Payment',
        methodCode: paymentMethod,
        status: isPaid ? 'Paid' : (isPayOnDelivery ? 'Pay on Delivery' : 'Pending'),
        isPaid: isPaid,
        isPayOnDelivery: isPayOnDelivery,
        razorpayOrderId: order.paymentDetails?.razorpayOrderId || null,
        razorpayPaymentId: order.paymentDetails?.razorpayPaymentId || null,
        paidAt: order.paymentDetails?.verifiedAt || null
      },

      // Timestamps
      timestamps: {
        created: order.createdAt,
        updated: order.updatedAt,
        delivered: order.deliveryPersonLocation?.deliveredAt || null
      }
    };

    return res.status(200).json({
      success: true,
      message: "Invoice generated successfully",
      invoice: invoice
    });

  } catch (error) {
    console.error("Get order invoice error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Helper function to generate route coordinates
const generateRouteCoordinates = (origin, destination, points = 20) => {
  const coordinates = [];
  for (let i = 0; i <= points; i++) {
    const ratio = i / points;
    const lat = origin.latitude + (destination.latitude - origin.latitude) * ratio;
    const lng = origin.longitude + (destination.longitude - origin.longitude) * ratio;

    // Add some realistic curve to the route
    const curveOffset = Math.sin(ratio * Math.PI) * 0.001;
    coordinates.push({
      latitude: lat + curveOffset,
      longitude: lng + curveOffset
    });
  }
  return coordinates;
};

// Mark COD payment as verified (collected by partner)
export const collectCodPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const partnerId = req.user._id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({ message: "Order must be marked as delivered before collecting payment" });
    }

    if (order.paymentDetails.paymentMethod !== 'cod') {
      return res.status(400).json({ message: "This is not a COD order" });
    }

    if (order.paymentStatus === 'verified') {
      return res.status(400).json({ message: "Payment already collected and verified" });
    }

    // Verify that the partner collecting is the one assigned
    if (order.deliveryPartner.toString() !== partnerId.toString()) {
      return res.status(403).json({ message: "You are not authorized to collect payment for this order" });
    }

    order.paymentStatus = 'verified';
    order.paymentDetails.verifiedAt = new Date();
    order.paymentDetails.method = 'cash';
    await order.save();

    // Notify rooms
    req.app.get('io').to(orderId).emit('paymentVerified', {
      orderId: order._id,
      paymentStatus: 'verified'
    });

    return res.status(200).json({
      message: "Payment collected successfully",
      order: order
    });
  } catch (error) {
    console.error("Collect COD payment error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};