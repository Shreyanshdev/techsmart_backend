import Product from "../../models/product.js";
import Inventory from "../../models/inventory.js";
import Branch from "../../models/branch.js";

/**
 * Product Controller
 * Updated for new schema: Products are master data, pricing/stock in Inventory
 */

// Get products by category ID (with optional branch for inventory)
export const getProductByCategoryId = async (req, res) => {
    const { categoryId } = req.params;
    const { page = 1, limit = 20, sort = 'createdAt', order = 'desc', branchId, branch: branchQuery } = req.query;
    const effectiveBranchId = branchId || branchQuery;

    try {
        const sortOrder = order === 'desc' ? -1 : 1;
        const skip = (page - 1) * limit;

        const products = await Product.find({
            category: categoryId,
            isActive: true
        })
            .populate('category', 'name')
            .sort({ [sort]: sortOrder })
            .skip(skip)
            .limit(parseInt(limit))
            .exec();

        const total = await Product.countDocuments({
            category: categoryId,
            isActive: true
        });

        // Always attempt to enrich with inventory data
        const productIds = products.map(p => p._id);

        let inventoryQuery = {
            product: { $in: productIds },
            isAvailable: true
        };

        if (effectiveBranchId) {
            inventoryQuery.branch = effectiveBranchId;
        }

        const inventory = await Inventory.find(inventoryQuery).sort({ 'pricing.sellingPrice': 1 });

        const inventoryMap = {};
        inventory.forEach(inv => {
            const pid = inv.product.toString();
            if (!inventoryMap[pid]) {
                inventoryMap[pid] = [];
            }
            inventoryMap[pid].push({
                _id: inv._id,
                inventoryId: inv._id,
                variant: inv.variant,
                pricing: inv.pricing,
                stock: inv.stock,
                isAvailable: inv.isAvailable
            });
        });

        const enrichedProducts = products.map(product => ({
            ...product.toObject(),
            variants: inventoryMap[product._id.toString()] || []
        }));

        return res.status(200).json({
            products: enrichedProducts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalProducts: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error("Error fetching products by category ID:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get all products with filtering and pagination
export const getAllProducts = async (req, res) => {
    const {
        page = 1,
        limit = 20,
        sort = 'createdAt',
        order = 'desc',
        brand,
        search,
        branchId,
        branch: branchQuery
    } = req.query;
    const effectiveBranchId = branchId || branchQuery;

    try {
        const sortOrder = order === 'desc' ? -1 : 1;
        const skip = (page - 1) * limit;

        // Build filter object
        const filter = { isActive: true };

        if (brand) filter.brand = new RegExp(brand, 'i');

        let query = Product.find(filter)
            .populate('category', 'name')
            .sort({ [sort]: sortOrder })
            .skip(skip)
            .limit(parseInt(limit));

        // Add text search if provided
        if (search) {
            query = Product.find({
                ...filter,
                $text: { $search: search }
            })
                .populate('category', 'name')
                .sort({ score: { $meta: 'textScore' }, [sort]: sortOrder })
                .skip(skip)
                .limit(parseInt(limit));
        }

        const products = await query.exec();
        const total = await Product.countDocuments(filter);

        // Always attempt to enrich with inventory data
        const productIds = products.map(p => p._id);

        let inventoryQuery = {
            product: { $in: productIds },
            isAvailable: true
        };

        if (effectiveBranchId) {
            inventoryQuery.branch = effectiveBranchId;
        }

        const inventory = await Inventory.find(inventoryQuery).sort({ 'pricing.sellingPrice': 1 });

        const inventoryMap = {};
        inventory.forEach(inv => {
            const pid = inv.product.toString();
            if (!inventoryMap[pid]) {
                inventoryMap[pid] = [];
            }
            inventoryMap[pid].push({
                _id: inv._id,
                inventoryId: inv._id,
                variant: inv.variant,
                pricing: inv.pricing,
                stock: inv.stock,
                isAvailable: inv.isAvailable
            });
        });

        const enrichedProducts = products.map(product => ({
            ...product.toObject(),
            variants: inventoryMap[product._id.toString()] || []
        }));

        return res.status(200).json({
            products: enrichedProducts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalProducts: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error("Error fetching all products:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get product by ID with full details and inventory from specified branch
export const getProductById = async (req, res) => {
    const { productId } = req.params;
    const { branchId, branch: branchQuery, latitude, longitude } = req.query;
    const effectiveBranchId = branchId || branchQuery;

    try {
        const product = await Product.findById(productId)
            .populate('category', 'name description')
            .exec();

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let inventory = [];

        // If branchId provided, get inventory for that branch
        if (effectiveBranchId) {
            inventory = await Inventory.find({
                product: productId,
                branch: effectiveBranchId,
                isAvailable: true
            }).populate('branch', 'name city');
        }
        // If location provided, find nearest branchs with this product
        else if (latitude && longitude) {
            const nearbyBranchs = await Branch.find({
                status: 'active',
                isActive: true,
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [parseFloat(longitude), parseFloat(latitude)]
                        },
                        $maxDistance: 10000 // 10km
                    }
                }
            }).limit(5);

            if (nearbyBranchs.length > 0) {
                inventory = await Inventory.find({
                    product: productId,
                    branch: { $in: nearbyBranchs.map(s => s._id) },
                    isAvailable: true,
                    stock: { $gt: 0 }
                }).populate('branch', 'name city');
            }
        }
        // Otherwise get all available inventory
        else {
            inventory = await Inventory.find({
                product: productId,
                isAvailable: true,
                stock: { $gt: 0 }
            }).populate('branch', 'name city').limit(10);
        }

        return res.status(200).json({
            product,
            variants: inventory.map(inv => ({
                inventoryId: inv._id,
                branch: inv.branch,
                variant: inv.variant,
                pricing: inv.pricing,
                stock: inv.stock,
                isAvailable: inv.isAvailable
            }))
        });
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Search products by tags and text
export const searchProducts = async (req, res) => {
    const {
        q,
        tags,
        category,
        page = 1,
        limit = 20,
        sort = 'createdAt',
        order = 'desc',
        branchId,
        branch: branchQuery
    } = req.query;
    const effectiveBranchId = branchId || branchQuery;

    try {
        const sortOrder = order === 'desc' ? -1 : 1;
        const skip = (page - 1) * limit;

        let filter = { isActive: true };

        // Text search
        if (q) {
            filter.$text = { $search: q };
        }

        // Tag search
        if (tags) {
            const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
            filter.tags = { $in: tagArray };
        }

        // Category filter
        if (category) {
            filter.category = category;
        }

        let query = Product.find(filter)
            .populate('category', 'name')
            .sort(q ? { score: { $meta: 'textScore' } } : { [sort]: sortOrder })
            .skip(skip)
            .limit(parseInt(limit));

        const products = await query.exec();
        const total = await Product.countDocuments(filter);

        // Enrich with inventory if branchId provided
        let enrichedProducts = products;
        if (effectiveBranchId) {
            const productIds = products.map(p => p._id);
            const inventory = await Inventory.find({
                branch: effectiveBranchId,
                product: { $in: productIds },
                isAvailable: true
            });

            const inventoryMap = {};
            inventory.forEach(inv => {
                if (!inventoryMap[inv.product.toString()]) {
                    inventoryMap[inv.product.toString()] = [];
                }
                inventoryMap[inv.product.toString()].push(inv);
            });

            enrichedProducts = products.map(product => ({
                ...product.toObject(),
                variants: inventoryMap[product._id.toString()] || []
            }));
        }

        return res.status(200).json({
            products: enrichedProducts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalProducts: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error("Error searching products:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get related products (uses manually set relatedProducts array, with fallback to category)
export const getRelatedProducts = async (req, res) => {
    const { productId } = req.params;
    const { limit = 8, branchId, branch: branchQuery } = req.query;
    const effectiveBranchId = branchId || branchQuery;

    try {
        const product = await Product.findById(productId).populate('relatedProducts', 'name images brand shortDescription category description variants attributes otherInformation');
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let relatedProducts = [];

        // First, use manually set related products if available
        if (product.relatedProducts && product.relatedProducts.length > 0) {
            relatedProducts = product.relatedProducts.filter(p => p && p.isActive !== false);
        }

        // Fallback to category-based if no manual relations or not enough
        if (relatedProducts.length < parseInt(limit)) {
            const additionalNeeded = parseInt(limit) - relatedProducts.length;
            const existingIds = relatedProducts.map(p => p._id.toString());
            existingIds.push(productId);

            const categoryRelated = await Product.find({
                $or: [
                    { category: product.category },
                    { subCategory: product.subCategory }
                ],
                _id: { $nin: existingIds },
                isActive: true
            })
                .populate('category', 'name')
                .limit(additionalNeeded);

            relatedProducts = [...relatedProducts, ...categoryRelated];
        }

        // Always try to enrich with inventory - look for any available branch if none specified
        const productIds = relatedProducts.map(p => p._id);

        let inventoryQuery = {
            product: { $in: productIds },
            isAvailable: true
        };

        if (effectiveBranchId) {
            inventoryQuery.branch = effectiveBranchId;
        }

        const inventory = await Inventory.find(inventoryQuery).sort({ 'pricing.sellingPrice': 1 });

        // Group all variants by product
        const inventoryMap = {};
        inventory.forEach(inv => {
            const pid = inv.product.toString();
            if (!inventoryMap[pid]) {
                inventoryMap[pid] = [];
            }
            inventoryMap[pid].push({
                _id: inv._id,
                inventoryId: inv._id,
                variant: inv.variant,
                pricing: inv.pricing,
                stock: inv.stock,
                isAvailable: inv.isAvailable
            });
        });

        const enrichedProducts = relatedProducts.map(p => ({
            ...(p.toObject ? p.toObject() : p),
            variants: inventoryMap[p._id.toString()] || []
        }));

        return res.status(200).json(enrichedProducts);
    } catch (error) {
        console.error("Error fetching related products:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get products by brand name
export const getProductsByBrand = async (req, res) => {
    const { brandName } = req.params;
    const { page = 1, limit = 20, branchId, branch: branchQuery } = req.query;
    const effectiveBranchId = branchId || branchQuery;

    try {
        const skip = (page - 1) * limit;

        // Find products by brand (case-insensitive)
        const products = await Product.find({
            brand: { $regex: new RegExp(`^${brandName}$`, 'i') },
            isActive: true
        })
            .populate('category', 'name')
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Product.countDocuments({
            brand: { $regex: new RegExp(`^${brandName}$`, 'i') },
            isActive: true
        });

        // Always try to enrich with inventory data
        const productIds = products.map(p => p._id);

        let inventoryQuery = {
            product: { $in: productIds },
            isAvailable: true
        };

        if (effectiveBranchId) {
            inventoryQuery.branch = effectiveBranchId;
        }

        const inventory = await Inventory.find(inventoryQuery).sort({ 'pricing.sellingPrice': 1 });

        // Group all variants by product
        const inventoryMap = {};
        inventory.forEach(inv => {
            const pid = inv.product.toString();
            if (!inventoryMap[pid]) {
                inventoryMap[pid] = [];
            }
            inventoryMap[pid].push({
                _id: inv._id,
                inventoryId: inv._id,
                variant: inv.variant,
                pricing: inv.pricing,
                stock: inv.stock,
                isAvailable: inv.isAvailable
            });
        });

        const enrichedProducts = products.map(product => ({
            ...product.toObject(),
            variants: inventoryMap[product._id.toString()] || []
        }));

        return res.status(200).json({
            brand: brandName,
            products: enrichedProducts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalProducts: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error("Error fetching products by brand:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get all available tags
export const getAllTags = async (req, res) => {
    try {
        const tags = await Product.distinct('tags', { isActive: true });
        return res.status(200).json(tags);
    } catch (error) {
        console.error("Error fetching tags:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get all brands
export const getAllBrands = async (req, res) => {
    try {
        const brands = await Product.distinct('brand', {
            isActive: true,
            brand: { $exists: true, $ne: null }
        });
        return res.status(200).json(brands);
    } catch (error) {
        console.error("Error fetching brands:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get products available at a specific branch
export const getBranchProducts = async (req, res) => {
    const { branchId } = req.params;
    const { category, page = 1, limit = 20 } = req.query;

    try {
        const skip = (page - 1) * limit;

        // Find all inventory for this branch
        let inventoryQuery = {
            branch: branchId,
            isAvailable: true,
            stock: { $gt: 0 }
        };

        const inventory = await Inventory.find(inventoryQuery)
            .populate({
                path: 'product',
                match: category ? { category, isActive: true } : { isActive: true },
                populate: { path: 'category', select: 'name' }
            })
            .sort({ displayOrder: 1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Filter out null products (when category filter doesn't match)
        const validInventory = inventory.filter(inv => inv.product);

        // Group by product
        const productMap = {};
        validInventory.forEach(inv => {
            const pid = inv.product._id.toString();
            if (!productMap[pid]) {
                productMap[pid] = {
                    product: inv.product,
                    variants: []
                };
            }
            productMap[pid].variants.push({
                inventoryId: inv._id,
                variant: inv.variant,
                pricing: inv.pricing,
                stock: inv.stock
            });
        });

        const products = Object.values(productMap);

        return res.status(200).json({
            branchId,
            products,
            count: products.length
        });
    } catch (error) {
        console.error("Error fetching branch products:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Admin: Create product
export const createProduct = async (req, res) => {
    try {
        const productData = req.body;

        const product = new Product(productData);
        await product.save();

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });
    } catch (error) {
        console.error("Error creating product:", error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: "Product with this name already exists"
            });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Admin: Update product
export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const updates = req.body;

        const product = await Product.findByIdAndUpdate(
            productId,
            { ...updates, updatedAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Admin: Delete product (soft delete)
export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findByIdAndUpdate(
            productId,
            { isActive: false, updatedAt: new Date() },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};