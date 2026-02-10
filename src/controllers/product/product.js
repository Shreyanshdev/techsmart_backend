import Product from "../../models/product.js";
import Inventory from "../../models/inventory.js";
import Branch from "../../models/branch.js";
import mongoose from "mongoose";

/**
 * Product Controller
 * Updated for new schema: Products are master data, pricing/stock in Inventory
 */

/**
 * GET /products/feed - Cursor-based paginated product feed
 * 
 * Industry-grade pagination like Zepto/Blinkit:
 * - Cursor-based (no offset issues with new data)
 * - Lightweight response (only data needed for cards)
 * - Branch-based filtering (required, single source of truth)
 * - Only returns products with available inventory
 * 
 * Query params:
 *   - branchId (required): Branch to fetch inventory from
 *   - limit: Number of products to fetch (default: 20, max: 50)
 *   - cursor: Last product ID from previous page (for pagination)
 *   - category: Optional category filter
 * 
 * Response:
 *   - products: Array of lightweight product objects
 *   - nextCursor: ID of last product (use for next page)
 *   - hasMore: Boolean indicating if more products exist
 */
export const getProductsFeed = async (req, res) => {
    const {
        branchId,
        branch: branchQuery,
        limit = 20,
        cursor,
        category,
        subcategory,
        brand
    } = req.query;

    const effectiveBranchId = branchId || branchQuery;
    const pageLimit = Math.min(parseInt(limit) || 20, 50); // Max 50 items per request

    try {
        // Branch is REQUIRED for feed endpoint
        if (!effectiveBranchId) {
            return res.status(400).json({
                message: "branchId is required for product feed",
                hint: "Pass branchId query parameter"
            });
        }

        // Validate branchId is valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(effectiveBranchId)) {
            return res.status(400).json({
                message: "Invalid branchId format"
            });
        }

        // Step 1: Find available inventory for this branch
        // IMPORTANT: Convert branchId string to ObjectId for aggregation matching
        const branchObjectId = new mongoose.Types.ObjectId(effectiveBranchId);

        let inventoryQuery = {
            branch: branchObjectId,
            isAvailable: true,
            stock: { $gt: 0 }
        };

        // Fetch inventory with product populated (lightweight fields only)
        let inventoryAggregation = [
            { $match: inventoryQuery },
            // Join with products
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'productData'
                }
            },
            { $unwind: '$productData' },
            // Filter active products only
            { $match: { 'productData.isActive': true } },
        ];

        // Subcategory filter (takes precedence over category)
        if (subcategory) {
            if (mongoose.Types.ObjectId.isValid(subcategory)) {
                inventoryAggregation.push({
                    $match: { 'productData.subCategory': new mongoose.Types.ObjectId(subcategory) }
                });
            }
        }
        // Category filter
        else if (category) {
            if (mongoose.Types.ObjectId.isValid(category)) {
                inventoryAggregation.push({
                    $match: { 'productData.category': new mongoose.Types.ObjectId(category) }
                });
            } else {
                // Support category by name/slug if needed (optional)
                inventoryAggregation.push({
                    $match: {
                        'productData.categoryName': { $regex: category, $options: 'i' }
                    }
                });
            }
        }

        // Brand filter
        if (brand) {
            inventoryAggregation.push({
                $match: { 'productData.brand': { $regex: new RegExp(`^${brand}$`, 'i') } }
            });
        }

        // Sort by inventory _id for consistent cursor pagination (no grouping - flattened)
        inventoryAggregation.push({ $sort: { '_id': 1 } });

        // Cursor-based pagination: fetch items after cursor
        if (cursor) {
            if (mongoose.Types.ObjectId.isValid(cursor)) {
                inventoryAggregation.push({
                    $match: { '_id': { $gt: new mongoose.Types.ObjectId(cursor) } }
                });
            }
        }

        // Limit + 1 to check if there are more items
        inventoryAggregation.push({ $limit: pageLimit + 1 });

        // Project flattened response - each variant is its own product entry
        inventoryAggregation.push({
            $project: {
                '_id': '$productData._id',
                'inventoryId': '$_id',
                'name': '$productData.name',
                'brand': '$productData.brand',
                'image': { $arrayElemAt: ['$productData.images', 0] },
                'images': '$productData.images',
                'shortDescription': '$productData.shortDescription',
                'category': '$productData.category',
                'rating': '$productData.rating',
                'tags': '$productData.tags',
                'variant': '$variant',
                'pricing': '$pricing',
                'stock': '$stock',
                'isAvailable': '$isAvailable'
            }
        });

        const results = await Inventory.aggregate(inventoryAggregation);

        // Check if there are more items
        const hasMore = results.length > pageLimit;
        const products = hasMore ? results.slice(0, pageLimit) : results;

        // Get next cursor (last item's inventoryId - NOT _id which is productId)
        const nextCursor = products.length > 0
            ? products[products.length - 1].inventoryId.toString()
            : null;

        return res.status(200).json({
            products,
            nextCursor,
            hasMore,
            count: products.length
        });

    } catch (error) {
        console.error("Error fetching products feed:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// Get products by category ID (with optional branch for inventory)
export const getProductByCategoryId = async (req, res) => {
    const { categoryId } = req.params;
    const { page = 1, limit = 20, sort = 'createdAt', order = 'desc', branchId, branch: branchQuery } = req.query;
    const effectiveBranchId = branchId || branchQuery;

    try {
        const sortOrder = order === 'desc' ? -1 : 1;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const intLimit = parseInt(limit);

        if (effectiveBranchId) {
            const branchObjectId = new mongoose.Types.ObjectId(effectiveBranchId);

            const inventoryAggregation = [
                {
                    $match: {
                        branch: branchObjectId,
                        isAvailable: true,
                        stock: { $gt: 0 }
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'product',
                        foreignField: '_id',
                        as: 'productData'
                    }
                },
                { $unwind: '$productData' },
                {
                    $match: {
                        'productData.isActive': true,
                        'productData.category': new mongoose.Types.ObjectId(categoryId)
                    }
                },
                { $sort: { [sort === 'createdAt' ? 'createdAt' : `productData.${sort}`]: sortOrder } },
                { $limit: intLimit + 1 },
                {
                    $project: {
                        '_id': '$productData._id',
                        'inventoryId': '$_id',
                        'name': '$productData.name',
                        'brand': '$productData.brand',
                        'image': { $arrayElemAt: ['$productData.images', 0] },
                        'images': '$productData.images',
                        'shortDescription': '$productData.shortDescription',
                        'category': '$productData.category',
                        'rating': '$productData.rating',
                        'tags': '$productData.tags',
                        'variant': '$variant',
                        'pricing': '$pricing',
                        'stock': '$stock',
                        'isAvailable': '$isAvailable'
                    }
                }
            ];

            const results = await Inventory.aggregate(inventoryAggregation);

            // Check if there are more items
            const hasMore = results.length > intLimit;
            const products = hasMore ? results.slice(0, intLimit) : results;

            // Get next cursor
            const nextCursor = products.length > 0
                ? products[products.length - 1].inventoryId.toString()
                : null;

            return res.status(200).json({
                products,
                nextCursor,
                hasMore,
                count: products.length
            });
        }

        // NO BRANCH FOUND: Return empty list
        return res.status(200).json({
            products: [],
            pagination: {
                currentPage: parseInt(page),
                totalPages: 0,
                totalProducts: 0,
                hasNext: false,
                hasPrev: false
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

        // If no branch, return empty immediately
        if (!effectiveBranchId) {
            return res.status(200).json({
                products: [],
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: 0,
                    totalProducts: 0,
                    hasNext: false,
                    hasPrev: false
                }
            });
        }

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
        const skip = (page - 1) * parseInt(limit);
        const intLimit = parseInt(limit);

        // If branchId provided, use aggregation for flattened products
        if (effectiveBranchId) {
            const branchObjectId = new mongoose.Types.ObjectId(effectiveBranchId);

            // Build product match conditions
            const productMatch = { 'productData.isActive': true };
            if (q) {
                productMatch.$or = [
                    { 'productData.name': { $regex: q, $options: 'i' } },
                    { 'productData.brand': { $regex: q, $options: 'i' } },
                    { 'productData.shortDescription': { $regex: q, $options: 'i' } }
                ];
            }
            if (tags) {
                const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
                productMatch['productData.tags'] = { $in: tagArray };
            }
            if (category) {
                productMatch['productData.category'] = new mongoose.Types.ObjectId(category);
            }

            const inventoryAggregation = [
                {
                    $match: {
                        branch: branchObjectId,
                        isAvailable: true,
                        stock: { $gt: 0 }
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'product',
                        foreignField: '_id',
                        as: 'productData'
                    }
                },
                { $unwind: '$productData' },
                { $match: productMatch },
                { $sort: { [`productData.${sort}`]: sortOrder } },
                { $skip: skip },
                { $limit: intLimit },
                {
                    $project: {
                        '_id': '$productData._id',
                        'inventoryId': '$_id',
                        'name': '$productData.name',
                        'brand': '$productData.brand',
                        'image': { $arrayElemAt: ['$productData.images', 0] },
                        'images': '$productData.images',
                        'shortDescription': '$productData.shortDescription',
                        'category': '$productData.category',
                        'rating': '$productData.rating',
                        'tags': '$productData.tags',
                        'variant': '$variant',
                        'pricing': '$pricing',
                        'stock': '$stock',
                        'isAvailable': '$isAvailable'
                    }
                }
            ];

            const products = await Inventory.aggregate(inventoryAggregation);

            // Count total for pagination (without skip/limit)
            const countAggregation = [
                { $match: { branch: branchObjectId, isAvailable: true, stock: { $gt: 0 } } },
                { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'productData' } },
                { $unwind: '$productData' },
                { $match: productMatch },
                { $count: 'total' }
            ];
            const countResult = await Inventory.aggregate(countAggregation);
            const total = countResult[0]?.total || 0;

            return res.status(200).json({
                products,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / intLimit),
                    totalProducts: total,
                    hasNext: parseInt(page) < Math.ceil(total / intLimit),
                    hasPrev: parseInt(page) > 1
                }
            });
        }

        // NO BRANCH FOUND: Return empty list
        return res.status(200).json({
            products: [],
            pagination: {
                currentPage: parseInt(page),
                totalPages: 0,
                totalProducts: 0,
                hasNext: false,
                hasPrev: false
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
    const { page = 1, limit = 8, branchId, branch: branchQuery } = req.query;
    const effectiveBranchId = branchId || branchQuery;
    const intPage = parseInt(page);
    const intLimit = parseInt(limit);
    const skip = (intPage - 1) * intLimit;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // If branchId provided, use aggregation for flattened products
        if (effectiveBranchId) {
            const branchObjectId = new mongoose.Types.ObjectId(effectiveBranchId);
            const productObjectId = new mongoose.Types.ObjectId(productId);
            const manualIds = (product.relatedProducts || []).map(id => new mongoose.Types.ObjectId(id));

            const inventoryAggregation = [
                {
                    $match: {
                        branch: branchObjectId,
                        isAvailable: true,
                        stock: { $gt: 0 }
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'product',
                        foreignField: '_id',
                        as: 'productData'
                    }
                },
                { $unwind: '$productData' },
                {
                    $match: {
                        'productData.isActive': true,
                        'productData._id': { $ne: productObjectId },
                        $or: [
                            { 'productData._id': { $in: manualIds } },
                            { 'productData.category': product.category },
                            { 'productData.brand': product.brand }
                        ]
                    }
                },
                { $sort: { 'pricing.sellingPrice': 1 } },
                { $skip: skip },
                { $limit: intLimit },
                {
                    $project: {
                        '_id': '$productData._id',
                        'inventoryId': '$_id',
                        'name': '$productData.name',
                        'brand': '$productData.brand',
                        'image': { $arrayElemAt: ['$productData.images', 0] },
                        'images': '$productData.images',
                        'shortDescription': '$productData.shortDescription',
                        'category': '$productData.category',
                        'rating': '$productData.rating',
                        'variant': '$variant',
                        'pricing': '$pricing',
                        'stock': '$stock',
                        'isAvailable': '$isAvailable'
                    }
                }
            ];

            const products = await Inventory.aggregate(inventoryAggregation);

            // Count total
            const countAggregation = [
                { $match: { branch: branchObjectId, isAvailable: true, stock: { $gt: 0 } } },
                { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'productData' } },
                { $unwind: '$productData' },
                {
                    $match: {
                        'productData.isActive': true,
                        'productData._id': { $ne: productObjectId },
                        $or: [
                            { 'productData._id': { $in: manualIds } },
                            { 'productData.category': product.category },
                            { 'productData.brand': product.brand }
                        ]
                    }
                },
                { $count: 'total' }
            ];
            const countResult = await Inventory.aggregate(countAggregation);
            const total = countResult[0]?.total || 0;

            return res.status(200).json({
                products,
                pagination: {
                    currentPage: intPage,
                    totalPages: Math.ceil(total / intLimit),
                    totalProducts: total,
                    hasNext: intPage < Math.ceil(total / intLimit),
                    hasPrev: intPage > 1
                }
            });
        }

        // NO BRANCH FOUND: Return empty list
        return res.status(200).json({
            products: [],
            pagination: {
                currentPage: intPage,
                totalPages: 0,
                totalProducts: 0,
                hasNext: false,
                hasPrev: false
            }
        });
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
    const intPage = parseInt(page);
    const intLimit = parseInt(limit);

    try {
        const skip = (intPage - 1) * intLimit;

        if (effectiveBranchId) {
            const branchObjectId = new mongoose.Types.ObjectId(effectiveBranchId);

            const inventoryAggregation = [
                {
                    $match: {
                        branch: branchObjectId,
                        isAvailable: true,
                        stock: { $gt: 0 }
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'product',
                        foreignField: '_id',
                        as: 'productData'
                    }
                },
                { $unwind: '$productData' },
                {
                    $match: {
                        'productData.isActive': true,
                        'productData.brand': { $regex: new RegExp(`^${brandName}$`, 'i') }
                    }
                },
                { $sort: { 'pricing.sellingPrice': 1 } },
                { $limit: intLimit + 1 },
                {
                    $project: {
                        '_id': '$productData._id',
                        'inventoryId': '$_id',
                        'name': '$productData.name',
                        'brand': '$productData.brand',
                        'image': { $arrayElemAt: ['$productData.images', 0] },
                        'images': '$productData.images',
                        'shortDescription': '$productData.shortDescription',
                        'category': '$productData.category',
                        'rating': '$productData.rating',
                        'tags': '$productData.tags',
                        'variant': '$variant',
                        'pricing': '$pricing',
                        'stock': '$stock',
                        'isAvailable': '$isAvailable'
                    }
                }
            ];

            const results = await Inventory.aggregate(inventoryAggregation);

            // Check if there are more items
            const hasMore = results.length > intLimit;
            const products = hasMore ? results.slice(0, intLimit) : results;

            // Get next cursor
            const nextCursor = products.length > 0
                ? products[products.length - 1].inventoryId.toString()
                : null;

            return res.status(200).json({
                brand: brandName,
                products,
                nextCursor,
                hasMore,
                count: products.length
            });
        }



        // NO BRANCH FOUND: Return empty list
        return res.status(200).json({
            brand: brandName,
            products: [],
            nextCursor: null,
            hasMore: false,
            count: 0
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