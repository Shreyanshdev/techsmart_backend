import HomeLayout from '../models/homeLayout.js';
import Category from '../models/category.js';
import SubCategory from '../models/subcategory.js';
import Product from '../models/product.js';
import Inventory from '../models/inventory.js';
import Banner from '../models/banner.js';
import BannerSection from '../models/bannerSection.js';
import ProductSection from '../models/productSection.js';
import BrandSpotlightSection from '../models/brandSpotlightSection.js';
import CategoryShowcaseSection from '../models/categoryShowcaseSection.js';

/**
 * Helper: Get lightweight product cards from inventory for a branch
 */
const getProductCards = async (branchId, filter = {}, limit = 10) => {
    const query = {
        branch: branchId,
        isAvailable: true,
        stock: { $gt: 0 },
        ...filter
    };

    const inventories = await Inventory.find(query)
        .populate('product', 'name brand category subCategory images shortDescription rating tags')
        .sort({ displayOrder: 1 })
        .limit(limit)
        .lean();

    return inventories
        .filter(inv => inv.product && inv.product.isActive !== false)
        .map(inv => ({
            _id: inv.product._id,
            name: inv.product.name,
            brand: inv.product.brand,
            images: inv.variant?.images?.length > 0 ? inv.variant.images : inv.product.images,
            rating: inv.product.rating,
            inventoryId: inv._id,
            variant: inv.variant,
            pricing: inv.pricing,
            stock: inv.stock,
            isAvailable: inv.isAvailable
        }));
};

/**
 * GET /home-layout/feed?branchId=xxx
 * Returns all active home layout sections with resolved data
 */
export const getHomeLayoutFeed = async (req, res) => {
    try {
        const { branchId } = req.query;

        // Get all active layout sections, ordered
        let sections = await HomeLayout.find({ isActive: true })
            .sort({ order: 1 })
            .lean();

        // Filter by branchId if targetBranches is populated
        if (branchId) {
            sections = sections.filter(s =>
                !s.targetBranches ||
                s.targetBranches.length === 0 ||
                s.targetBranches.some(tb => tb.toString() === branchId.toString())
            );
        }

        // Resolve each section's data based on type
        const resolvedSections = await Promise.all(
            sections.map(async (section) => {
                try {
                    switch (section.type) {
                        case 'BANNER_CAROUSEL': {
                            // Prefer new BannerSection config if linked
                            if (section.bannerSection) {
                                const bannerSection = await BannerSection.findById(section.bannerSection).lean();
                                if (bannerSection && bannerSection.isActive !== false) {
                                    let slides = [];
                                    if (bannerSection.isCarousel && bannerSection.slides?.length) {
                                        slides = bannerSection.slides
                                            .slice()
                                            .sort((a, b) => (a.order || 0) - (b.order || 0))
                                            .map(s => ({
                                                imageUrl: s.imageUrl,
                                                title: s.title || bannerSection.title || '',
                                                buttonText: s.buttonText || '',
                                                actionType: s.actionType || 'NONE',
                                                targetValue:
                                                    s.actionType === 'PRODUCT' && s.targetProduct
                                                        ? s.targetProduct.toString()
                                                        : s.actionType === 'CATEGORY' && s.targetCategory
                                                            ? s.targetCategory.toString()
                                                            : s.actionType === 'BRAND' && s.targetBrand
                                                                ? s.targetBrand
                                                                : ''
                                            }));
                                    } else if (bannerSection.imageUrl) {
                                        slides = [{
                                            imageUrl: bannerSection.imageUrl,
                                            title: bannerSection.title || '',
                                            buttonText: bannerSection.buttonText || '',
                                            actionType: bannerSection.actionType || 'NONE',
                                            targetValue:
                                                bannerSection.actionType === 'PRODUCT' && bannerSection.targetProduct
                                                    ? bannerSection.targetProduct.toString()
                                                    : bannerSection.actionType === 'CATEGORY' && bannerSection.targetCategory
                                                        ? bannerSection.targetCategory.toString()
                                                        : bannerSection.actionType === 'BRAND' && bannerSection.targetBrand
                                                            ? bannerSection.targetBrand
                                                            : ''
                                        }];
                                    }

                                    if (slides.length > 0) {
                                        return { ...section, resolvedData: { slides } };
                                    }
                                }
                            }

                            // Legacy: Use data.slides if provided, otherwise fetch from Banner model
                            if (section.data?.slides?.length > 0) {
                                return { ...section, resolvedData: { slides: section.data.slides } };
                            }
                            const position = section.data?.position || 'HOME_MAIN';
                            const banner = await Banner.findOne({ position, isActive: true }).lean();
                            return {
                                ...section,
                                resolvedData: {
                                    slides: banner?.slides || []
                                }
                            };
                        }

                        case 'CATEGORY_GRID': {
                            const categories = await Category.find({ isActive: true })
                                .sort({ order: 1 })
                                .lean();

                            // Fetch subcategories for each category
                            const categoryIds = categories.map(c => c._id);
                            const subcategories = await SubCategory.find({
                                category: { $in: categoryIds },
                                isActive: true
                            }).sort({ order: 1 }).lean();

                            const categoriesWithSubs = categories.map(cat => ({
                                ...cat,
                                subcategories: subcategories.filter(
                                    sub => sub.category.toString() === cat._id.toString()
                                )
                            }));

                            return {
                                ...section,
                                resolvedData: { categories: categoriesWithSubs }
                            };
                        }

                        case 'PRODUCT_STRIP':
                        case 'FEATURED_SECTION': {
                            if (!branchId) {
                                return { ...section, resolvedData: { products: [] } };
                            }

                            // Prefer new ProductSection config if linked
                            let products = [];
                            let actionType = 'none';
                            let targetValue = '';
                            let backgroundColor;
                            let gradientColors;

                            if (section.productSection) {
                                const ps = await ProductSection.findById(section.productSection).lean();
                                if (ps && ps.isActive !== false) {
                                    const limit = ps.limit || 10;
                                    backgroundColor = ps.backgroundColor;
                                    gradientColors = ps.gradientColors;

                                    switch (ps.sectionKind) {
                                        case 'TRENDING':
                                            products = await getProductCards(branchId, {}, limit);
                                            products.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
                                            actionType = 'trending';
                                            break;
                                        case 'HOT_DEAL':
                                            products = await getProductCards(branchId, {}, limit * 2);
                                            products = products
                                                .filter(p => p.pricing && p.pricing.mrp > p.pricing.sellingPrice)
                                                .sort((a, b) => {
                                                    const discA = ((a.pricing.mrp - a.pricing.sellingPrice) / a.pricing.mrp) * 100;
                                                    const discB = ((b.pricing.mrp - b.pricing.sellingPrice) / b.pricing.mrp) * 100;
                                                    return discB - discA;
                                                })
                                                .slice(0, limit);
                                            actionType = 'deals';
                                            break;
                                        case 'NEW':
                                            {
                                                const newInventories = await Inventory.find({
                                                    branch: branchId,
                                                    isAvailable: true,
                                                    stock: { $gt: 0 }
                                                })
                                                    .populate('product', 'name brand category subCategory images shortDescription rating tags')
                                                    .sort({ createdAt: -1 })
                                                    .limit(limit)
                                                    .lean();

                                                products = newInventories
                                                    .filter(inv => inv.product && inv.product.isActive !== false)
                                                    .map(inv => ({
                                                        _id: inv.product._id,
                                                        name: inv.product.name,
                                                        brand: inv.product.brand,
                                                        images: inv.variant?.images?.length > 0 ? inv.variant.images : inv.product.images,
                                                        rating: inv.product.rating,
                                                        inventoryId: inv._id,
                                                        variant: inv.variant,
                                                        pricing: inv.pricing,
                                                        stock: inv.stock,
                                                        isAvailable: inv.isAvailable
                                                    }));
                                                actionType = 'new';
                                            }
                                            break;
                                        case 'CATEGORY':
                                            if (ps.category) {
                                                const catProducts = await Product.find({
                                                    category: ps.category,
                                                    isActive: true
                                                }).select('_id').lean();
                                                const productIds = catProducts.map(p => p._id);
                                                products = await getProductCards(branchId, {
                                                    product: { $in: productIds }
                                                }, limit);
                                                actionType = 'category';
                                                targetValue = ps.category.toString();
                                            }
                                            break;
                                        case 'SPONSORED':
                                            if (ps.handpickedProducts && ps.handpickedProducts.length > 0) {
                                                products = await getProductCards(branchId, {
                                                    product: { $in: ps.handpickedProducts }
                                                }, ps.handpickedProducts.length);
                                                actionType = 'none';
                                            }
                                            break;
                                        default:
                                            break;
                                    }
                                }
                            }

                            // Legacy fallback if no ProductSection or no products found
                            if (products.length === 0) {
                                const { filterType, filterValue, limit = 10, categoryId } = section.data || {};
                                switch (filterType) {
                                    case 'trending':
                                        products = await getProductCards(branchId, {}, limit);
                                        products.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
                                        actionType = 'trending';
                                        break;
                                    case 'deals':
                                        products = await getProductCards(branchId, {}, limit * 2);
                                        products = products
                                            .filter(p => p.pricing && p.pricing.mrp > p.pricing.sellingPrice)
                                            .sort((a, b) => {
                                                const discA = ((a.pricing.mrp - a.pricing.sellingPrice) / a.pricing.mrp) * 100;
                                                const discB = ((b.pricing.mrp - b.pricing.sellingPrice) / b.pricing.mrp) * 100;
                                                return discB - discA;
                                            })
                                            .slice(0, limit);
                                        actionType = 'deals';
                                        break;
                                    case 'new':
                                        {
                                            const newInventories = await Inventory.find({
                                                branch: branchId,
                                                isAvailable: true,
                                                stock: { $gt: 0 }
                                            })
                                                .populate('product', 'name brand category subCategory images shortDescription rating tags')
                                                .sort({ createdAt: -1 })
                                                .limit(limit)
                                                .lean();

                                            products = newInventories
                                                .filter(inv => inv.product && inv.product.isActive !== false)
                                                .map(inv => ({
                                                    _id: inv.product._id,
                                                    name: inv.product.name,
                                                    brand: inv.product.brand,
                                                    images: inv.variant?.images?.length > 0 ? inv.variant.images : inv.product.images,
                                                    rating: inv.product.rating,
                                                    inventoryId: inv._id,
                                                    variant: inv.variant,
                                                    pricing: inv.pricing,
                                                    stock: inv.stock,
                                                    isAvailable: inv.isAvailable
                                                }));
                                            actionType = 'new';
                                        }
                                        break;
                                    case 'category':
                                        {
                                            const catId = categoryId || filterValue;
                                            if (catId) {
                                                const catProducts = await Product.find({
                                                    category: catId,
                                                    isActive: true
                                                }).select('_id').lean();
                                                const productIds = catProducts.map(p => p._id);
                                                products = await getProductCards(branchId, {
                                                    product: { $in: productIds }
                                                }, limit);
                                                actionType = 'category';
                                                targetValue = catId;
                                            }
                                        }
                                        break;
                                    default:
                                        if (section.data?.productIds && section.data.productIds.length > 0) {
                                            products = await getProductCards(branchId, {
                                                product: { $in: section.data.productIds }
                                            }, section.data.productIds.length);
                                            actionType = 'none';
                                        }
                                }

                                backgroundColor = backgroundColor || section.data?.backgroundColor;
                                gradientColors = gradientColors || section.data?.gradientColors;
                            }

                            return {
                                ...section,
                                resolvedData: {
                                    products,
                                    actionType,
                                    targetValue,
                                    backgroundColor,
                                    gradientColors,
                                }
                            };
                        }

                        case 'BRAND_SPOTLIGHT': {
                            if (!branchId) {
                                return { ...section, resolvedData: { products: [] } };
                            }

                            let products = [];
                            let brandName;
                            let brandLogo;
                            let backgroundColor = '#FFF8E1';

                            // Prefer new BrandSpotlightSection config
                            if (section.brandSpotlightSection) {
                                const bs = await BrandSpotlightSection.findById(section.brandSpotlightSection).lean();
                                if (bs && bs.isActive !== false) {
                                    brandName = bs.brandName;
                                    brandLogo = bs.brandLogo || '';
                                    backgroundColor = bs.backgroundColor || backgroundColor;

                                    if (bs.handpickedProducts && bs.handpickedProducts.length > 0) {
                                        products = await getProductCards(branchId, {
                                            product: { $in: bs.handpickedProducts }
                                        }, bs.handpickedProducts.length);
                                    } else if (bs.brandName) {
                                        const brandProducts = await Product.find({
                                            brand: { $regex: new RegExp(`^${bs.brandName}$`, 'i') },
                                            isActive: true
                                        }).select('_id').lean();

                                        const brandProductIds = brandProducts.map(p => p._id);
                                        products = await getProductCards(branchId, {
                                            product: { $in: brandProductIds }
                                        }, bs.limit || 10);
                                    }
                                }
                            }

                            // Legacy fallback
                            if (products.length === 0) {
                                if (!section.data?.brandName && !section.data?.productIds) {
                                    return { ...section, resolvedData: { products: [] } };
                                }

                                brandName = brandName || section.data.brandName;
                                brandLogo = brandLogo || section.data.brandLogo || '';
                                backgroundColor = section.data.backgroundColor || backgroundColor;

                                if (section.data?.productIds && section.data.productIds.length > 0) {
                                    products = await getProductCards(branchId, {
                                        product: { $in: section.data.productIds }
                                    }, section.data.productIds.length);
                                } else if (section.data?.brandName) {
                                    const brandProducts = await Product.find({
                                        brand: { $regex: new RegExp(`^${section.data.brandName}$`, 'i') },
                                        isActive: true
                                    }).select('_id').lean();

                                    const brandProductIds = brandProducts.map(p => p._id);
                                    products = await getProductCards(branchId, {
                                        product: { $in: brandProductIds }
                                    }, section.data?.limit || 10);
                                }
                            }

                            return {
                                ...section,
                                resolvedData: {
                                    brandName: brandName || '',
                                    brandLogo: brandLogo || '',
                                    backgroundColor,
                                    products,
                                    actionType: 'brand',
                                    targetValue: brandName || ''
                                }
                            };
                        }

                        case 'CATEGORY_SHOWCASE': {
                            if (!branchId) {
                                return { ...section, resolvedData: { category: null, products: [] } };
                            }

                            // Prefer new CategoryShowcaseSection
                            let categoryId = null;
                            let limit = 8;

                            if (section.categoryShowcaseSection) {
                                const cs = await CategoryShowcaseSection.findById(section.categoryShowcaseSection).lean();
                                if (cs && cs.isActive !== false) {
                                    categoryId = cs.category;
                                    limit = cs.limit || limit;
                                }
                            }

                            // Legacy fallback
                            if (!categoryId && section.data?.categoryId) {
                                categoryId = section.data.categoryId;
                                limit = section.data?.limit || limit;
                            }

                            if (!categoryId) {
                                return { ...section, resolvedData: { category: null, products: [] } };
                            }

                            const category = await Category.findById(categoryId).lean();
                            const catProducts = await Product.find({
                                category: categoryId,
                                isActive: true
                            }).select('_id').lean();

                            const productIds = catProducts.map(p => p._id);
                            const products = await getProductCards(branchId, {
                                product: { $in: productIds }
                            }, limit);

                            return {
                                ...section,
                                resolvedData: { category, products }
                            };
                        }

                        case 'CUSTOM_BANNER': {
                            return {
                                ...section,
                                resolvedData: {
                                    imageUrl: section.data?.imageUrl || '',
                                    actionType: section.data?.actionType || 'NONE',
                                    targetValue: section.data?.targetValue || ''
                                }
                            };
                        }

                        default:
                            return section;
                    }
                } catch (err) {
                    console.error(`Error resolving section ${section._id}:`, err);
                    return { ...section, resolvedData: null, error: 'Failed to resolve' };
                }
            })
        );

        // Filter out sections with no meaningful data
        const validSections = resolvedSections.filter(s => {
            if (!s.resolvedData) return false;
            if (s.type === 'BANNER_CAROUSEL' && (!s.resolvedData.slides || s.resolvedData.slides.length === 0)) return false;
            if (s.type === 'PRODUCT_STRIP' && (!s.resolvedData.products || s.resolvedData.products.length === 0)) return false;
            if (s.type === 'BRAND_SPOTLIGHT' && (!s.resolvedData.products || s.resolvedData.products.length === 0)) return false;
            if (s.type === 'CATEGORY_SHOWCASE' && (!s.resolvedData.products || s.resolvedData.products.length === 0)) return false;
            return true;
        });

        res.json({ sections: validSections });
    } catch (error) {
        console.error('Home layout feed error:', error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * POST /home-layout/seed
 * Seeds sample home layout sections for testing
 */
export const seedHomeLayout = async (req, res) => {
    try {
        await HomeLayout.deleteMany({});
        await BannerSection.deleteMany({});
        await ProductSection.deleteMany({});
        await BrandSpotlightSection.deleteMany({});
        await CategoryShowcaseSection.deleteMany({});

        // Get exact real data from DB to reference explicitly
        const categories = await Category.find({ isActive: true }).limit(3).lean();
        const brands = await Product.distinct('brand', { isActive: true, brand: { $ne: null, $ne: '' } });
        const realProducts = await Product.find({ isActive: true }).limit(30).select('_id').lean();

        const allProductIds = realProducts.map(p => p._id);

        // --- Create dedicated section configs (Blinkit-style) ---

        // 1. Banner sections
        const mainBanner = await BannerSection.create({
            name: 'Home Main Carousel',
            isCarousel: true,
            slides: [
                {
                    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop',
                    title: 'Fresh Groceries Delivered Fast',
                    buttonText: 'Shop Now',
                    actionType: 'NONE',
                    order: 1
                }
            ],
            isActive: true
        });

        const secondaryBanner = await BannerSection.create({
            name: 'Home Secondary Banner',
            isCarousel: false,
            imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2070&auto=format&fit=crop',
            title: 'Big Savings on Daily Essentials',
            buttonText: 'View Deals',
            actionType: 'NONE',
            isActive: true
        });

        // 2. Product sections (rules-based)
        const trendingSection = await ProductSection.create({
            name: 'Trending Now',
            title: 'Trending Now 🔥',
            subtitle: 'Most popular products near you',
            sectionKind: 'TRENDING',
            limit: 10,
            backgroundColor: '#FFF1F2',
            gradientColors: ['#FFE4E6', '#FCA5A5'],
            isActive: true
        });

        const hotDealsSection = await ProductSection.create({
            name: 'Hot Deals',
            title: 'Hot Deals 💰',
            subtitle: 'Best discounts right now',
            sectionKind: 'HOT_DEAL',
            limit: 10,
            isActive: true
        });

        const newArrivalsSection = await ProductSection.create({
            name: 'New Arrivals',
            title: 'New Arrivals ✨',
            subtitle: 'Freshly added items',
            sectionKind: 'NEW',
            limit: 10,
            isActive: true
        });

        // 3. Brand spotlight section
        let brandSpotlightSectionDoc = null;
        if (brands.length > 0) {
            brandSpotlightSectionDoc = await BrandSpotlightSection.create({
                name: `Brand Spotlight - ${brands[0]}`,
                title: `From ${brands[0]}`,
                subtitle: `Popular picks from ${brands[0]}`,
                brandName: brands[0],
                brandLogo: '',
                limit: 8,
                backgroundColor: '#E8F5E9',
                isActive: true
            });
        }

        // 4. Category showcase section
        let categoryShowcaseSectionDoc = null;
        if (categories.length > 0) {
            categoryShowcaseSectionDoc = await CategoryShowcaseSection.create({
                name: `Showcase - ${categories[0].name}`,
                title: categories[0].name,
                subtitle: `Explore best of ${categories[0].name}`,
                category: categories[0]._id,
                limit: 8,
                isActive: true
            });
        }

        // --- Create HomeLayout rows that reference these section configs ---

        const sections = [];

        // 1. Main Banner Carousel (top hero)
        sections.push({
            type: 'BANNER_CAROUSEL',
            title: '',
            bannerSection: mainBanner._id,
            order: 1,
            isActive: true
        });

        // 2. Category Grid
        sections.push({
            type: 'CATEGORY_GRID',
            title: 'Shop by Category',
            order: 2,
            isActive: true
        });

        // 3. Trending Now (Featured section UI)
        sections.push({
            type: 'FEATURED_SECTION',
            title: trendingSection.title,
            subtitle: trendingSection.subtitle,
            productSection: trendingSection._id,
            order: 3,
            isActive: true
        });

        // 4. Custom Banner - simple promo (legacy-style for now)
        sections.push({
            type: 'CUSTOM_BANNER',
            data: {
                imageUrl: 'https://images.unsplash.com/photo-1514996937319-344454492b37?q=80&w=2070&auto=format&fit=crop',
                actionType: 'NONE',
                targetValue: ''
            },
            order: 4,
            isActive: true
        });

        // 5. Hot Deals product strip
        sections.push({
            type: 'PRODUCT_STRIP',
            title: hotDealsSection.title,
            subtitle: hotDealsSection.subtitle,
            productSection: hotDealsSection._id,
            order: 5,
            isActive: true
        });

        // 6. Secondary Banner Carousel
        sections.push({
            type: 'BANNER_CAROUSEL',
            title: '',
            bannerSection: secondaryBanner._id,
            order: 6,
            isActive: true
        });

        // 7. New Arrivals strip
        sections.push({
            type: 'PRODUCT_STRIP',
            title: newArrivalsSection.title,
            subtitle: newArrivalsSection.subtitle,
            productSection: newArrivalsSection._id,
            order: 7,
            isActive: true
        });

        // 8. Brand Spotlight
        if (brandSpotlightSectionDoc) {
            sections.push({
                type: 'BRAND_SPOTLIGHT',
                title: brandSpotlightSectionDoc.title,
                brandSpotlightSection: brandSpotlightSectionDoc._id,
                order: 8,
                isActive: true
            });
        }

        // 9. Category Showcase
        if (categoryShowcaseSectionDoc) {
            sections.push({
                type: 'CATEGORY_SHOWCASE',
                title: categoryShowcaseSectionDoc.title,
                subtitle: categoryShowcaseSectionDoc.subtitle,
                categoryShowcaseSection: categoryShowcaseSectionDoc._id,
                order: 9,
                isActive: true
            });
        }

        const inserted = await HomeLayout.insertMany(sections);

        res.json({
            message: 'Home layout seeded successfully with dedicated section configs.',
            count: inserted.length,
            sections: inserted
        });
    } catch (error) {
        console.error('Seed error:', error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * POST /home-layout
 * Create or update a section (Admin)
 */
export const upsertSection = async (req, res) => {
    try {
        const { _id, type, title, subtitle, data, order, isActive } = req.body;

        if (_id) {
            const updated = await HomeLayout.findByIdAndUpdate(_id, {
                type, title, subtitle, data, order, isActive
            }, { new: true });
            return res.json(updated);
        }

        const section = await HomeLayout.create({
            type, title, subtitle, data, order, isActive: isActive !== false
        });
        res.status(201).json(section);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * DELETE /home-layout/:id
 */
export const deleteSection = async (req, res) => {
    try {
        await HomeLayout.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
