import Product from "../../models/product.js";

// Get products by category ID
export const getProductByCategoryId = async (req, res) => {
    const { categoryId } = req.params;
    const { page = 1, limit = 20, sort = 'createdAt', order = 'desc' } = req.query;

    try {
        const sortOrder = order === 'desc' ? -1 : 1;
        const skip = (page - 1) * limit;

        const products = await Product.find({
            category: categoryId,
            status: 'active'
        })
            .populate('category', 'name')
            .sort({ [sort]: sortOrder })
            .skip(skip)
            .limit(parseInt(limit))
            .exec();

        const total = await Product.countDocuments({
            category: categoryId,
            status: 'active'
        });

        return res.status(200).json({
            products,
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
        featured,
        brand,
        minPrice,
        maxPrice,
        search
    } = req.query;

    try {
        const sortOrder = order === 'desc' ? -1 : 1;
        const skip = (page - 1) * limit;

        // Build filter object
        const filter = { status: 'active' };

        if (featured === 'true') filter.featured = true;
        if (brand) filter.brand = new RegExp(brand, 'i');
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
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

        return res.status(200).json({
            products,
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

// Get product by ID with full details
export const getProductById = async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await Product.findById(productId)
            .populate('category', 'name description')
            .exec();

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json(product);
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
        order = 'desc'
    } = req.query;

    try {
        const sortOrder = order === 'desc' ? -1 : 1;
        const skip = (page - 1) * limit;

        let filter = { status: 'active' };

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
            .populate('relatedProducts', 'name images price discountPrice')
            .sort(q ? { score: { $meta: 'textScore' } } : { [sort]: sortOrder })
            .skip(skip)
            .limit(parseInt(limit));

        const products = await query.exec();
        const total = await Product.countDocuments(filter);

        return res.status(200).json({
            products,
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

// Get related products
export const getRelatedProducts = async (req, res) => {
    const { productId } = req.params;
    const { limit = 8 } = req.query;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Get related products from same category (since relatedProducts field removed)
        const relatedProducts = await Product.find({
            category: product.category,
            _id: { $ne: productId },
            status: 'active'
        })
            .select('name images price discountPrice shortDescription')
            .limit(parseInt(limit));

        return res.status(200).json(relatedProducts);
    } catch (error) {
        console.error("Error fetching related products:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get featured products
export const getFeaturedProducts = async (req, res) => {
    const { limit = 10 } = req.query;

    try {
        const products = await Product.find({
            featured: true,
            status: 'active'
        })
            .populate('category', 'name')
            .select('name images price discountPrice shortDescription ratings featured')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        return res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching featured products:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get subscription-available products
export const getSubscriptionAvailableProducts = async (req, res) => {
    const { page = 1, limit = 20, category } = req.query;

    try {
        const skip = (page - 1) * limit;
        const filter = {
            status: 'active',
            isSubscriptionAvailable: true
        };

        if (category) {
            filter.category = category;
        }

        const products = await Product.find(filter)
            .populate('category', 'name')
            .select('name images price discountPrice shortDescription isSubscriptionAvailable subscriptionConfig shelfLife')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Product.countDocuments(filter);

        return res.status(200).json({
            products,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalProducts: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error("Error fetching subscription-available products:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// Get all available tags
export const getAllTags = async (req, res) => {
    try {
        const tags = await Product.distinct('tags', { status: 'active' });
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
            status: 'active',
            brand: { $exists: true, $ne: null }
        });
        return res.status(200).json(brands);
    } catch (error) {
        console.error("Error fetching brands:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};