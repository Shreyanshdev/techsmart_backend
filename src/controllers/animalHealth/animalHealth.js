import AnimalHealth from "../../models/animalHealth.js";
import Product from "../../models/product.js";
import Subscription from "../../models/subscription.js";

/**
 * Get animal health records for a specific product
 * User must be subscribed to this product to view
 */
export const getAnimalHealthByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.userId;

        // Verify user is subscribed to this product
        const subscription = await Subscription.findOne({
            customer: userId,
            status: { $in: ['active', 'expiring'] },
            'products.productId': productId
        });

        if (!subscription) {
            return res.status(403).json({
                success: false,
                message: "You must be subscribed to this product to view animal health information"
            });
        }

        // Get animal health records for this product
        const healthRecords = await AnimalHealth.find({
            productId,
            isActive: true
        }).sort({ updatedAt: -1 });

        // Get product info for context
        const product = await Product.findById(productId).select('name breed animalType images');

        res.status(200).json({
            success: true,
            product: {
                _id: product._id,
                name: product.name,
                breedName: product.breed,
                animalType: product.animalType
            },
            healthRecords,
            count: healthRecords.length
        });
    } catch (error) {
        console.error("Error fetching animal health:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch animal health information"
        });
    }
};

/**
 * Get animal health for all subscribed products
 */
export const getMySubscribedProductsHealth = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get active subscriptions
        const subscriptions = await Subscription.find({
            customer: userId,
            status: { $in: ['active', 'expiring'] }
        }).populate('products.productId', 'name breed animalType images');

        if (!subscriptions || subscriptions.length === 0) {
            return res.status(200).json({
                success: true,
                subscribedProducts: [],
                message: "No active subscriptions found"
            });
        }

        // Extract unique product IDs from all subscriptions
        const productIds = [];
        const productMap = new Map();

        subscriptions.forEach(sub => {
            sub.products.forEach(p => {
                if (p.productId && !productMap.has(p.productId._id.toString())) {
                    productMap.set(p.productId._id.toString(), {
                        _id: p.productId._id,
                        name: p.productId.name || p.productName,
                        breedName: p.productId.breed,
                        animalType: p.productId.animalType,
                        image: p.productId.images?.[0]
                    });
                    productIds.push(p.productId._id);
                }
            });
        });

        // Get health records for all subscribed products
        const healthRecords = await AnimalHealth.find({
            productId: { $in: productIds },
            isActive: true
        }).sort({ productId: 1, updatedAt: -1 });

        // Group health records by product
        const healthByProduct = {};
        healthRecords.forEach(record => {
            const pid = record.productId.toString();
            if (!healthByProduct[pid]) {
                healthByProduct[pid] = [];
            }
            healthByProduct[pid].push(record);
        });

        // Build response with products and their health records
        const subscribedProducts = Array.from(productMap.values()).map(product => ({
            ...product,
            healthRecords: healthByProduct[product._id.toString()] || []
        }));

        res.status(200).json({
            success: true,
            subscribedProducts,
            count: subscribedProducts.length
        });
    } catch (error) {
        console.error("Error fetching subscribed products health:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch animal health information"
        });
    }
};

/**
 * Admin: Create animal health record
 */
export const createAnimalHealth = async (req, res) => {
    try {
        const healthData = req.body;

        // Validate product exists and get breed
        const product = await Product.findById(healthData.productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Use product's breed if not provided
        if (!healthData.breedName && product.breed) {
            healthData.breedName = product.breed;
        }

        const animalHealth = new AnimalHealth(healthData);
        await animalHealth.save();

        res.status(201).json({
            success: true,
            message: "Animal health record created successfully",
            animalHealth
        });
    } catch (error) {
        console.error("Error creating animal health:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create animal health record"
        });
    }
};

/**
 * Admin: Update animal health record
 */
export const updateAnimalHealth = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const animalHealth = await AnimalHealth.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: new Date() },
            { new: true }
        );

        if (!animalHealth) {
            return res.status(404).json({
                success: false,
                message: "Animal health record not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Animal health record updated successfully",
            animalHealth
        });
    } catch (error) {
        console.error("Error updating animal health:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update animal health record"
        });
    }
};

/**
 * Admin: Delete animal health record
 */
export const deleteAnimalHealth = async (req, res) => {
    try {
        const { id } = req.params;

        const animalHealth = await AnimalHealth.findByIdAndDelete(id);

        if (!animalHealth) {
            return res.status(404).json({
                success: false,
                message: "Animal health record not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Animal health record deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting animal health:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete animal health record"
        });
    }
};
