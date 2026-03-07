import mongoose from 'mongoose';
import Product from './src/models/product.js';
import Banner from './src/models/banner.js';
import Inventory from './src/models/inventory.js';
import HomeLayout from './src/models/homeLayout.js';

async function run() {
    await mongoose.connect('mongodb+srv://Shreyanshdodev:Shreyanshop1@cluster0.dxwyrja.mongodb.net/Takesmart');

    // 1. Fix banners targetValue
    const validProduct = await Product.findOne({ isActive: true });
    if (validProduct) {
        console.log('Found valid product: ', validProduct._id);
        const banners = await Banner.find({});
        for (let b of banners) {
            let updated = false;
            b.slides.forEach(slide => {
                if (slide.actionType === 'PRODUCT' && String(slide.targetValue) === '6966a46631b8bd513b79fdde') {
                    slide.targetValue = validProduct._id.toString();
                    updated = true;
                }
            });
            if (updated) {
                await b.save();
                console.log('Updated banner:', b.position);
            }
        }
    }

    // 2. Check if the admin-seeded products have inventory
    const strips = await HomeLayout.find({ type: { $in: ['PRODUCT_STRIP', 'FEATURED_SECTION'] } });
    for (let s of strips) {
        if (s.data && s.data.productIds && s.data.productIds.length > 0) {
            const count = await Inventory.countDocuments({
                product: { $in: s.data.productIds },
                stock: { $gt: 0 },
                isAvailable: true
            });
            console.log(`Section: ${s.title} has ${count} available inventory records out of ${s.data.productIds.length} seeded products`);
        }
    }

    process.exit(0);
}

run();
