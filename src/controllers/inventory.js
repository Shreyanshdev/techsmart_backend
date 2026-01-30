import Inventory from "../models/inventory.js";
import Product from "../models/product.js";
import Branch from "../models/branch.js";
import mongoose from "mongoose";
import NodeCache from "node-cache";

const stockCache = new NodeCache({ stdTTL: 5 }); // 5 second cache for stock checks

/**
 * Inventory Controller
 * Handles inventory CRUD, stock management, and branch-product queries
 */

// Create inventory entry (add product variant to branch)
export const createInventory = async (req, res) => {
    try {
        const {
            branchId,
            productId,
            variant,
            pricing,
            stock,
            lowStockThreshold
        } = req.body;

        // Validate branch exists
        const branch = await Branch.findById(branchId);
        if (!branch) {
            return res.status(404).json({
                success: false,
                error: "Branch not found"
            });
        }

        // Validate product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                error: "Product not found"
            });
        }

        // Check if this variant already exists for this branch+product
        const existing = await Inventory.findOne({
            branch: branchId,
            product: productId,
            'variant.sku': variant.sku
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                error: "This product variant already exists in this branch"
            });
        }

        const inventory = new Inventory({
            branch: branchId,
            product: productId,
            variant,
            pricing,
            stock: stock || 0,
            lowStockThreshold: lowStockThreshold || 10,
            isAvailable: stock > 0
        });

        await inventory.save();

        // Populate references for response
        await inventory.populate([
            { path: 'branch', select: 'name city branchId' },
            { path: 'product', select: 'name brand category' }
        ]);

        res.status(201).json({
            success: true,
            message: "Inventory created successfully",
            inventory
        });
    } catch (error) {
        console.error("Error creating inventory:", error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: "Duplicate inventory entry"
            });
        }
        res.status(500).json({
            success: false,
            error: "Failed to create inventory"
        });
    }
};

// Get inventory for a branch (with optional product filter)
export const getBranchInventory = async (req, res) => {
    try {
        const { branchId } = req.params;
        const { productId, category, available, lowStock, page = 1, limit = 50 } = req.query;

        const filter = { branch: branchId };

        if (productId) filter.product = productId;
        if (available === 'true') filter.isAvailable = true;

        let inventoryQuery = Inventory.find(filter)
            .populate('product', 'name brand category images shortDescription');

        // If category filter, we need aggregation
        if (category) {
            const inventory = await Inventory.aggregate([
                { $match: { branch: new mongoose.Types.ObjectId(branchId) } },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'product',
                        foreignField: '_id',
                        as: 'productData'
                    }
                },
                { $unwind: '$productData' },
                { $match: { 'productData.category': new mongoose.Types.ObjectId(category) } },
                { $skip: (page - 1) * limit },
                { $limit: parseInt(limit) }
            ]);

            return res.json({
                success: true,
                count: inventory.length,
                inventory
            });
        }

        const inventory = await inventoryQuery
            .sort({ displayOrder: 1, 'variant.packSize': 1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Filter for low stock if requested
        const result = lowStock === 'true'
            ? inventory.filter(i => i.stock <= i.lowStockThreshold)
            : inventory;

        res.json({
            success: true,
            count: result.length,
            inventory: result
        });
    } catch (error) {
        console.error("Error fetching branch inventory:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch inventory"
        });
    }
};

// Get inventory by ID
export const getInventoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const inventory = await Inventory.findById(id)
            .populate('branch', 'name city branchId')
            .populate('product', 'name brand category images description');

        if (!inventory) {
            return res.status(404).json({
                success: false,
                error: "Inventory not found"
            });
        }

        res.json({
            success: true,
            inventory
        });
    } catch (error) {
        console.error("Error fetching inventory:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch inventory"
        });
    }
};

// Update inventory (pricing, stock, availability)
export const updateInventory = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const inventory = await Inventory.findByIdAndUpdate(
            id,
            { ...updates, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).populate([
            { path: 'branch', select: 'name city branchId' },
            { path: 'product', select: 'name brand category' }
        ]);

        if (!inventory) {
            return res.status(404).json({
                success: false,
                error: "Inventory not found"
            });
        }

        res.json({
            success: true,
            message: "Inventory updated successfully",
            inventory
        });
    } catch (error) {
        console.error("Error updating inventory:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update inventory"
        });
    }
};

// Update stock level
export const updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity, operation = 'set' } = req.body;

        if (quantity === undefined || quantity === null) {
            return res.status(400).json({
                success: false,
                error: "Quantity is required"
            });
        }

        let update;
        switch (operation) {
            case 'increment':
                update = { $inc: { stock: quantity } };
                break;
            case 'decrement':
                update = { $inc: { stock: -quantity } };
                break;
            case 'set':
            default:
                update = { stock: quantity };
        }

        const inventory = await Inventory.findByIdAndUpdate(
            id,
            { ...update, updatedAt: new Date() },
            { new: true }
        );

        if (!inventory) {
            return res.status(404).json({
                success: false,
                error: "Inventory not found"
            });
        }

        // Auto-update availability based on stock via pre-save hook
        await inventory.save();

        res.json({
            success: true,
            message: "Stock updated successfully",
            inventory: {
                _id: inventory._id,
                stock: inventory.stock,
                isAvailable: inventory.isAvailable,
                isLowStock: inventory.stock <= inventory.lowStockThreshold
            }
        });
    } catch (error) {
        console.error("Error updating stock:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update stock"
        });
    }
};

// Bulk update inventory (for admin)
export const bulkUpdateInventory = async (req, res) => {
    try {
        const { updates } = req.body; // Array of { inventoryId, ...fields }

        if (!Array.isArray(updates) || updates.length === 0) {
            return res.status(400).json({
                success: false,
                error: "Updates array is required"
            });
        }

        const bulkOps = updates.map(update => ({
            updateOne: {
                filter: { _id: update.inventoryId },
                update: {
                    $set: {
                        ...update,
                        updatedAt: new Date()
                    }
                }
            }
        }));

        const result = await Inventory.bulkWrite(bulkOps);

        res.json({
            success: true,
            message: "Bulk update completed",
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error("Error in bulk update:", error);
        res.status(500).json({
            success: false,
            error: "Failed to perform bulk update"
        });
    }
};

// Delete inventory
export const deleteInventory = async (req, res) => {
    try {
        const { id } = req.params;

        const inventory = await Inventory.findByIdAndDelete(id);

        if (!inventory) {
            return res.status(404).json({
                success: false,
                error: "Inventory not found"
            });
        }

        res.json({
            success: true,
            message: "Inventory deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting inventory:", error);
        res.status(500).json({
            success: false,
            error: "Failed to delete inventory"
        });
    }
};

// Get product availability across all branches
export const getProductAvailability = async (req, res) => {
    try {
        const { productId } = req.params;
        const { latitude, longitude } = req.query;

        let query = Inventory.find({
            product: productId,
            isAvailable: true,
            stock: { $gt: 0 }
        }).populate('branch', 'name city location branchId deliveryRadiusKm');

        const inventory = await query;

        // If location provided, sort by distance
        if (latitude && longitude) {
            const lat = parseFloat(latitude);
            const lng = parseFloat(longitude);

            inventory.sort((a, b) => {
                const distA = calculateDistance(lat, lng, a.branch.lat, a.branch.lng);
                const distB = calculateDistance(lat, lng, b.branch.lat, b.branch.lng);
                return distA - distB;
            });
        }

        res.json({
            success: true,
            count: inventory.length,
            availability: inventory.map(i => ({
                inventoryId: i._id,
                branch: i.branch,
                variant: i.variant,
                pricing: i.pricing,
                stock: i.stock
            }))
        });
    } catch (error) {
        console.error("Error fetching product availability:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch availability"
        });
    }
};

// Helper: Haversine distance
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Update cart item quantity with atomic stock check
 * Ensures user can only add what's available
 */
export const updateCartItemQuantity = async (req, res) => {
    try {
        const { inventoryId, requestedQty } = req.body;

        if (!inventoryId || requestedQty === undefined) {
            return res.status(400).json({
                success: false,
                error: "inventoryId and requestedQty are required"
            });
        }

        const inv = await Inventory.findById(inventoryId).populate('product', 'name');
        if (!inv) {
            return res.status(404).json({
                success: false,
                error: "Product variant not found"
            });
        }

        const availableStock = Math.max(0, inv.stock || 0);
        const maxQtyLimit = inv.variant?.maxQtyPerOrder || 0;

        let finalQty = Math.max(0, requestedQty);
        let message = "";

        // Decision logic: Backend decides the quantity
        if (finalQty > availableStock) {
            finalQty = availableStock;
            message = `Only ${availableStock} items left`;
        }

        if (maxQtyLimit > 0 && finalQty > maxQtyLimit) {
            finalQty = maxQtyLimit;
            message = `Maximum ${maxQtyLimit} items allowed per order`;
        }

        return res.json({
            success: true,
            finalQty,
            message,
            availableStock
        });
    } catch (error) {
        console.error("Error updating cart item quantity:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update quantity"
        });
    }
};

/**
 * Validate cart items stock availability
 * Called before checkout to ensure all items are in stock
 * Returns detailed stock status for each item
 */
export const validateCartStock = async (req, res) => {
    try {
        const { items } = req.body; // Array of { inventoryId, quantity }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                error: "Items array is required"
            });
        }

        // Caching: Try to get results from cache if same query
        const cacheKey = `validate_${JSON.stringify(items)}`;
        const cachedResult = stockCache.get(cacheKey);
        if (cachedResult) {
            return res.json(cachedResult);
        }

        // Get all inventory items in one query
        const inventoryIds = items.map(item => item.inventoryId);
        const inventoryItems = await Inventory.find({ _id: { $in: inventoryIds } })
            .populate('product', 'name brand images')
            .lean();

        // Create a map for quick lookup
        const inventoryMap = new Map();
        inventoryItems.forEach(inv => {
            inventoryMap.set(inv._id.toString(), inv);
        });

        // Validate each item
        const validationResults = [];
        let allAvailable = true;
        let hasOutOfStock = false;
        let hasInsufficientStock = false;

        for (const item of items) {
            const inv = inventoryMap.get(item.inventoryId);

            if (!inv) {
                // Item not found
                validationResults.push({
                    inventoryId: item.inventoryId,
                    requestedQuantity: item.quantity,
                    available: false,
                    status: 'NOT_FOUND',
                    message: 'Product not found',
                    productName: 'Unknown',
                    availableStock: 0,
                    canOrder: 0
                });
                allAvailable = false;
                hasOutOfStock = true;
                continue;
            }

            // Calculate available stock (ignore reservedStock for validation per user request)
            const availableStock = Math.max(0, inv.stock || 0);
            const requestedQty = item.quantity || 1;

            if (!inv.isAvailable || inv.stock <= 0) {
                // Out of stock
                validationResults.push({
                    inventoryId: item.inventoryId,
                    requestedQuantity: requestedQty,
                    available: false,
                    status: 'OUT_OF_STOCK',
                    message: `${inv.product?.name || 'Product'} is out of stock`,
                    productName: inv.product?.name || 'Unknown',
                    productImage: inv.variant?.images?.[0] || inv.product?.images?.[0] || '',
                    variantSku: inv.variant?.sku,
                    packSize: inv.variant?.packSize,
                    availableStock: 0,
                    canOrder: 0
                });
                allAvailable = false;
                hasOutOfStock = true;
            } else if (availableStock < requestedQty) {
                // Insufficient stock
                validationResults.push({
                    inventoryId: item.inventoryId,
                    requestedQuantity: requestedQty,
                    available: false,
                    status: 'INSUFFICIENT_STOCK',
                    message: `Only ${availableStock} ${inv.variant?.packSize || 'units'} available for ${inv.product?.name || 'Product'}`,
                    productName: inv.product?.name || 'Unknown',
                    productImage: inv.variant?.images?.[0] || inv.product?.images?.[0] || '',
                    variantSku: inv.variant?.sku,
                    packSize: inv.variant?.packSize,
                    availableStock: availableStock,
                    canOrder: availableStock,
                    price: inv.pricing?.sellingPrice
                });
                allAvailable = false;
                hasInsufficientStock = true;
            } else {
                // Available
                validationResults.push({
                    inventoryId: item.inventoryId,
                    requestedQuantity: requestedQty,
                    available: true,
                    status: 'AVAILABLE',
                    message: 'In stock',
                    productName: inv.product?.name || 'Unknown',
                    productImage: inv.variant?.images?.[0] || inv.product?.images?.[0] || '',
                    variantSku: inv.variant?.sku,
                    packSize: inv.variant?.packSize,
                    availableStock: availableStock,
                    canOrder: requestedQty,
                    price: inv.pricing?.sellingPrice
                });
            }
        }

        // Determine overall status message
        let overallMessage = 'All items are available';
        if (hasOutOfStock && hasInsufficientStock) {
            overallMessage = 'Some items are out of stock or have limited availability';
        } else if (hasOutOfStock) {
            overallMessage = 'Some items are out of stock';
        } else if (hasInsufficientStock) {
            overallMessage = 'Some items have limited stock';
        }

        const response = {
            success: true,
            allAvailable,
            hasOutOfStock,
            hasInsufficientStock,
            message: overallMessage,
            items: validationResults,
            validatedAt: new Date().toISOString()
        };

        // Store in cache for 5 seconds
        stockCache.set(cacheKey, response);

        res.json(response);
    } catch (error) {
        console.error("Error validating cart stock:", error);
        res.status(500).json({
            success: false,
            error: "Failed to validate stock",
            allAvailable: false
        });
    }
};

