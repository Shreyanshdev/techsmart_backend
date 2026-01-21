import Banner from '../../models/banner.js';

// Get all banners
export const getBanners = async (req, res) => {
    try {
        const banners = await Banner.find({ isActive: true });
        // Transform into a map for easy frontend lookup by position
        const bannerMap = {};
        banners.forEach(b => {
            bannerMap[b.position] = b;
        });
        res.json(bannerMap);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create or Update Banner (Admin)
export const upsertBanner = async (req, res) => {
    try {
        const { position, slides } = req.body;

        if (!['HOME_MAIN', 'HOME_SECONDARY'].includes(position)) {
            return res.status(400).json({ message: 'Invalid position' });
        }

        const banner = await Banner.findOneAndUpdate(
            { position },
            {
                position,
                slides,
                isActive: true
            },
            { new: true, upsert: true }
        );

        res.json(banner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Seed Banners (Dev only)
export const seedBanners = async (req, res) => {
    try {
        await Banner.deleteMany({}); // Clear existing

        // Dynamically import Product model to avoid circular dependency issues if any
        // or just standard import since we are in ES modules
        const Product = (await import('../../models/product.js')).default;

        const product = await Product.findOne({ isActive: true });

        const banners = [
            {
                position: 'HOME_MAIN',
                slides: [
                    {
                        imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop',
                        title: 'Super Sale Live Now!',
                        buttonText: 'Shop Now',
                        actionType: 'NONE',
                        order: 1
                    },
                    {
                        imageUrl: 'https://images.unsplash.com/photo-1556656793-02715d8dd660?q=80&w=2070&auto=format&fit=crop',
                        title: 'New Electronics',
                        buttonText: 'Check it out',
                        actionType: product ? 'PRODUCT' : 'NONE',
                        targetValue: product ? product._id.toString() : '',
                        order: 2
                    }
                ]
            },
            {
                position: 'HOME_SECONDARY',
                slides: [
                    {
                        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop',
                        title: 'Fresh Groceries',
                        buttonText: 'Order Now',
                        actionType: 'NONE',
                        order: 1
                    },
                    {
                        imageUrl: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?q=80&w=2023&auto=format&fit=crop',
                        title: 'Best Sellers',
                        buttonText: 'View All',
                        actionType: product ? 'PRODUCT' : 'NONE',
                        targetValue: product ? product._id.toString() : '',
                        order: 2
                    }
                ]
            }
        ];

        await Banner.insertMany(banners);
        res.json({ message: 'Banners seeded successfully', banners });
    } catch (error) {
        console.error('Seeding error:', error);
        res.status(500).json({ message: error.message });
    }
};
