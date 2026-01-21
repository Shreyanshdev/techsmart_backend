/**
 * Seed Data Script - Creates Branch, Categories, Products, and Inventory
 * Run: node scripts/seedData.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Branch from '../src/models/branch.js';
import Product from '../src/models/product.js';
import Category from '../src/models/category.js';
import Inventory from '../src/models/inventory.js';

dotenv.config();

// Kanpur coordinates
const KANPUR_LOCATION = {
    type: 'Point',
    coordinates: [80.3319, 26.4499] // [lng, lat]
};

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // ===== 1. CREATE BRANCH =====
        let branch = await Branch.findOne({ city: 'Kanpur' });
        if (!branch) {
            branch = new Branch({
                name: 'TakeSmart Kanpur Central',
                city: 'Kanpur',
                address: '123 Mall Road, Civil Lines, Kanpur, Uttar Pradesh 208001',
                pincode: '208001',
                location: KANPUR_LOCATION,
                status: 'active',
                deliveryRadiusKm: 10,
                phone: '+91-9876543210',
                email: 'kanpur@takesmart.com',
                isActive: true,
                operatingHours: {
                    monday: { open: '08:00', close: '21:00' },
                    tuesday: { open: '08:00', close: '21:00' },
                    wednesday: { open: '08:00', close: '21:00' },
                    thursday: { open: '08:00', close: '21:00' },
                    friday: { open: '08:00', close: '21:00' },
                    saturday: { open: '08:00', close: '22:00' },
                    sunday: { open: '09:00', close: '20:00' }
                }
            });
            await branch.save();
            console.log('✅ Branch created:', branch.name);
        } else {
            console.log('ℹ️ Branch already exists:', branch.name);
        }

        // ===== 2. CREATE CATEGORIES =====
        const categoryData = [
            { name: 'Dairy Products', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400' },
            { name: 'Organic Oils', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400' },
            { name: 'Fresh Ghee', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400' },
            { name: 'Honey & Sweeteners', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400' }
        ];

        const categories = {};
        for (const cat of categoryData) {
            let category = await Category.findOne({ name: cat.name });
            if (!category) {
                category = await Category.create(cat);
                console.log('✅ Category created:', cat.name);
            }
            categories[cat.name] = category._id;
        }

        // ===== 3. CREATE PRODUCTS =====
        const productsData = [
            // Dairy Products
            {
                name: 'Farm Fresh A2 Cow Milk',
                brand: 'TakeSmart',
                category: categories['Dairy Products'],
                shortDescription: 'Pure A2 cow milk from grass-fed desi cows',
                description: 'Our A2 cow milk comes from indigenous Gir and Sahiwal cows, raised on organic pastures. Rich in A2 beta-casein protein, easier to digest and packed with natural goodness. Delivered fresh daily.',
                images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600'],
                tags: ['organic', 'fresh', 'daily', 'a2-milk'],
                attributes: [
                    { key: 'Source', value: 'Gir & Sahiwal Cows' },
                    { key: 'Fat Content', value: '3.5-4%' },
                    { key: 'Shelf Life', value: '2 Days' }
                ]
            },
            {
                name: 'Organic Buffalo Milk',
                brand: 'TakeSmart',
                category: categories['Dairy Products'],
                shortDescription: 'Creamy buffalo milk, perfect for chai and sweets',
                description: 'Premium quality buffalo milk with high fat content, ideal for making rich paneer, khoya, and delicious chai. Sourced from healthy Murrah buffaloes.',
                images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600'],
                tags: ['organic', 'fresh', 'creamy', 'buffalo-milk'],
                attributes: [
                    { key: 'Fat Content', value: '6-7%' },
                    { key: 'Best For', value: 'Chai, Paneer, Khoya' }
                ]
            },
            {
                name: 'Fresh Paneer',
                brand: 'TakeSmart',
                category: categories['Dairy Products'],
                shortDescription: 'Soft and fresh cottage cheese made daily',
                description: 'Handmade fresh paneer from pure cow milk. Soft, spongy texture perfect for curries, tikkas, and desserts. No preservatives added.',
                images: ['https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600'],
                tags: ['fresh', 'handmade', 'vegetarian', 'protein'],
                attributes: [
                    { key: 'Made From', value: '100% Cow Milk' },
                    { key: 'Texture', value: 'Soft & Spongy' }
                ]
            },
            {
                name: 'Organic Dahi (Curd)',
                brand: 'TakeSmart',
                category: categories['Dairy Products'],
                shortDescription: 'Traditional set curd with live cultures',
                description: 'Thick, creamy dahi made using traditional methods. Rich in probiotics for gut health. Perfect for raita, lassi, or enjoying plain.',
                images: ['https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600'],
                tags: ['probiotic', 'fresh', 'traditional', 'healthy'],
                attributes: [
                    { key: 'Culture', value: 'Live Probiotic' },
                    { key: 'Setting', value: 'Traditional Earthen Pot' }
                ]
            },
            // Organic Oils
            {
                name: 'Cold Pressed Mustard Oil',
                brand: 'TakeSmart',
                category: categories['Organic Oils'],
                shortDescription: 'Traditional kachi ghani mustard oil',
                description: 'Pure cold-pressed mustard oil extracted using traditional wooden ghani. Retains natural pungency and all nutritional benefits. Ideal for cooking, pickling, and massage.',
                images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600'],
                tags: ['cold-pressed', 'traditional', 'kachi-ghani', 'cooking'],
                attributes: [
                    { key: 'Extraction', value: 'Wooden Ghani' },
                    { key: 'Purity', value: '100% Pure' }
                ]
            },
            {
                name: 'Virgin Coconut Oil',
                brand: 'TakeSmart',
                category: categories['Organic Oils'],
                shortDescription: 'Cold pressed virgin coconut oil',
                description: 'Premium virgin coconut oil extracted from fresh coconuts. Perfect for cooking, skin care, and hair care. Rich in MCTs and lauric acid.',
                images: ['https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600'],
                tags: ['virgin', 'organic', 'multi-use', 'healthy'],
                attributes: [
                    { key: 'Type', value: 'Virgin Unrefined' },
                    { key: 'Uses', value: 'Cooking, Skin, Hair' }
                ]
            },
            {
                name: 'Groundnut Oil',
                brand: 'TakeSmart',
                category: categories['Organic Oils'],
                shortDescription: 'Pure cold-pressed peanut oil',
                description: 'Traditional cold-pressed groundnut oil with authentic aroma. High smoke point makes it perfect for deep frying and everyday cooking.',
                images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600'],
                tags: ['cold-pressed', 'cooking', 'traditional'],
                attributes: [
                    { key: 'Smoke Point', value: 'High' },
                    { key: 'Best For', value: 'Frying & Cooking' }
                ]
            },
            // Fresh Ghee
            {
                name: 'Pure Desi Cow Ghee',
                brand: 'TakeSmart',
                category: categories['Fresh Ghee'],
                shortDescription: 'Bilona method A2 cow ghee',
                description: 'Premium A2 cow ghee made using traditional Bilona (hand-churned) method. Golden yellow color with rich aroma. Ideal for cooking, religious purposes, and Ayurvedic uses.',
                images: ['https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600'],
                tags: ['bilona', 'a2-ghee', 'traditional', 'ayurvedic'],
                attributes: [
                    { key: 'Method', value: 'Bilona Hand-Churned' },
                    { key: 'Source', value: 'A2 Desi Cow Milk' }
                ]
            },
            {
                name: 'Buffalo Ghee',
                brand: 'TakeSmart',
                category: categories['Fresh Ghee'],
                shortDescription: 'Rich creamy buffalo ghee',
                description: 'White creamy ghee made from pure buffalo milk. Higher fat content gives richer taste. Perfect for parathas, dal, and sweets.',
                images: ['https://images.unsplash.com/photo-1631452180775-93c8f64ef12f?w=600'],
                tags: ['buffalo', 'creamy', 'rich', 'cooking'],
                attributes: [
                    { key: 'Color', value: 'Creamy White' },
                    { key: 'Taste', value: 'Rich & Heavy' }
                ]
            },
            // Honey & Sweeteners
            {
                name: 'Raw Forest Honey',
                brand: 'TakeSmart',
                category: categories['Honey & Sweeteners'],
                shortDescription: 'Unprocessed wild forest honey',
                description: 'Pure raw honey collected from wild bee hives in forest areas. Unprocessed, unheated, retaining all natural enzymes and pollen. Dark amber with rich floral notes.',
                images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600'],
                tags: ['raw', 'forest', 'unprocessed', 'natural'],
                attributes: [
                    { key: 'Type', value: 'Wild Forest' },
                    { key: 'Processing', value: 'Raw Unheated' }
                ]
            },
            {
                name: 'Organic Jaggery',
                brand: 'TakeSmart',
                category: categories['Honey & Sweeteners'],
                shortDescription: 'Chemical-free pure cane jaggery',
                description: 'Traditional jaggery made from organic sugarcane juice. No chemicals or additives. Rich in iron and minerals. Perfect healthy sweetener for chai and desserts.',
                images: ['https://images.unsplash.com/photo-1604251416902-b57e93c359c1?w=600'],
                tags: ['organic', 'natural', 'iron-rich', 'traditional'],
                attributes: [
                    { key: 'Source', value: 'Organic Sugarcane' },
                    { key: 'Chemicals', value: 'None' }
                ]
            },
            {
                name: 'Date Palm Jaggery',
                brand: 'TakeSmart',
                category: categories['Honey & Sweeteners'],
                shortDescription: 'Premium nolen gur from Bengal',
                description: 'Authentic date palm jaggery (Nolen Gur) from Bengal. Unique caramel-like flavor. Seasonal delicacy, perfect for sweets and direct consumption.',
                images: ['https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600'],
                tags: ['seasonal', 'bengal', 'premium', 'date-palm'],
                attributes: [
                    { key: 'Origin', value: 'West Bengal' },
                    { key: 'Season', value: 'Winter Special' }
                ]
            }
        ];

        const products = [];
        for (const prod of productsData) {
            let product = await Product.findOne({ name: prod.name });
            if (!product) {
                product = await Product.create({
                    ...prod,
                    isActive: true,
                    otherInformation: [
                        { label: 'Country of Origin', value: 'India' },
                        { label: 'FSSAI License', value: '10012345678910' },
                        { label: 'Manufacturer', value: 'TakeSmart Organics Pvt Ltd' }
                    ],
                    rating: { average: 0, count: 0 }
                });
                console.log('✅ Product created:', prod.name);
            }
            products.push(product);
        }

        // ===== 4. CREATE INVENTORY (Variants per product) =====
        const inventoryData = [
            // Milk variants
            {
                productName: 'Farm Fresh A2 Cow Milk', variants: [
                    { sku: 'A2MILK_500ML', packSize: '500 ml', weightValue: 500, weightUnit: 'ml', mrp: 45, sellingPrice: 40, stock: 100 },
                    { sku: 'A2MILK_1L', packSize: '1 Litre', weightValue: 1, weightUnit: 'l', mrp: 85, sellingPrice: 75, stock: 80 }
                ]
            },
            {
                productName: 'Organic Buffalo Milk', variants: [
                    { sku: 'BUFMILK_500ML', packSize: '500 ml', weightValue: 500, weightUnit: 'ml', mrp: 55, sellingPrice: 50, stock: 60 },
                    { sku: 'BUFMILK_1L', packSize: '1 Litre', weightValue: 1, weightUnit: 'l', mrp: 100, sellingPrice: 90, stock: 50 }
                ]
            },
            {
                productName: 'Fresh Paneer', variants: [
                    { sku: 'PANEER_200G', packSize: '200 g', weightValue: 200, weightUnit: 'g', mrp: 100, sellingPrice: 90, stock: 40 },
                    { sku: 'PANEER_500G', packSize: '500 g', weightValue: 500, weightUnit: 'g', mrp: 220, sellingPrice: 200, stock: 30 }
                ]
            },
            {
                productName: 'Organic Dahi (Curd)', variants: [
                    { sku: 'DAHI_400G', packSize: '400 g', weightValue: 400, weightUnit: 'g', mrp: 50, sellingPrice: 45, stock: 50 },
                    { sku: 'DAHI_1KG', packSize: '1 kg', weightValue: 1, weightUnit: 'kg', mrp: 110, sellingPrice: 100, stock: 40 }
                ]
            },
            // Oils
            {
                productName: 'Cold Pressed Mustard Oil', variants: [
                    { sku: 'MUSTOIL_500ML', packSize: '500 ml', weightValue: 500, weightUnit: 'ml', mrp: 180, sellingPrice: 160, stock: 30 },
                    { sku: 'MUSTOIL_1L', packSize: '1 Litre', weightValue: 1, weightUnit: 'l', mrp: 340, sellingPrice: 300, stock: 25 }
                ]
            },
            {
                productName: 'Virgin Coconut Oil', variants: [
                    { sku: 'COCOIL_500ML', packSize: '500 ml', weightValue: 500, weightUnit: 'ml', mrp: 350, sellingPrice: 320, stock: 20 },
                    { sku: 'COCOIL_1L', packSize: '1 Litre', weightValue: 1, weightUnit: 'l', mrp: 650, sellingPrice: 599, stock: 15 }
                ]
            },
            {
                productName: 'Groundnut Oil', variants: [
                    { sku: 'GNOIL_1L', packSize: '1 Litre', weightValue: 1, weightUnit: 'l', mrp: 280, sellingPrice: 250, stock: 25 }
                ]
            },
            // Ghee
            {
                productName: 'Pure Desi Cow Ghee', variants: [
                    { sku: 'COWGHEE_250G', packSize: '250 g', weightValue: 250, weightUnit: 'g', mrp: 400, sellingPrice: 360, stock: 30 },
                    { sku: 'COWGHEE_500G', packSize: '500 g', weightValue: 500, weightUnit: 'g', mrp: 750, sellingPrice: 680, stock: 25 },
                    { sku: 'COWGHEE_1KG', packSize: '1 kg', weightValue: 1, weightUnit: 'kg', mrp: 1400, sellingPrice: 1250, stock: 20 }
                ]
            },
            {
                productName: 'Buffalo Ghee', variants: [
                    { sku: 'BUFGHEE_500G', packSize: '500 g', weightValue: 500, weightUnit: 'g', mrp: 550, sellingPrice: 500, stock: 20 },
                    { sku: 'BUFGHEE_1KG', packSize: '1 kg', weightValue: 1, weightUnit: 'kg', mrp: 1050, sellingPrice: 950, stock: 15 }
                ]
            },
            // Honey & Sweeteners
            {
                productName: 'Raw Forest Honey', variants: [
                    { sku: 'HONEY_250G', packSize: '250 g', weightValue: 250, weightUnit: 'g', mrp: 250, sellingPrice: 220, stock: 25 },
                    { sku: 'HONEY_500G', packSize: '500 g', weightValue: 500, weightUnit: 'g', mrp: 450, sellingPrice: 400, stock: 20 }
                ]
            },
            {
                productName: 'Organic Jaggery', variants: [
                    { sku: 'JAGGERY_500G', packSize: '500 g', weightValue: 500, weightUnit: 'g', mrp: 80, sellingPrice: 70, stock: 50 },
                    { sku: 'JAGGERY_1KG', packSize: '1 kg', weightValue: 1, weightUnit: 'kg', mrp: 150, sellingPrice: 130, stock: 40 }
                ]
            },
            {
                productName: 'Date Palm Jaggery', variants: [
                    { sku: 'NOLENGUR_250G', packSize: '250 g', weightValue: 250, weightUnit: 'g', mrp: 180, sellingPrice: 160, stock: 15 }
                ]
            }
        ];

        let inventoryCount = 0;
        for (const inv of inventoryData) {
            const product = products.find(p => p.name === inv.productName);
            if (!product) continue;

            for (const variant of inv.variants) {
                const existing = await Inventory.findOne({
                    branch: branch._id,
                    product: product._id,
                    'variant.sku': variant.sku
                });

                if (!existing) {
                    await Inventory.create({
                        branch: branch._id,
                        product: product._id,
                        variant: {
                            sku: variant.sku,
                            packSize: variant.packSize,
                            weightValue: variant.weightValue,
                            weightUnit: variant.weightUnit
                        },
                        pricing: {
                            mrp: variant.mrp,
                            sellingPrice: variant.sellingPrice,
                            costPrice: variant.sellingPrice * 0.7
                        },
                        stock: variant.stock,
                        lowStockThreshold: 10,
                        isAvailable: true
                    });
                    inventoryCount++;
                }
            }
        }
        console.log(`✅ Created ${inventoryCount} inventory entries`);

        console.log('\n========================================');
        console.log('🎉 SEED DATA COMPLETE!');
        console.log('========================================');
        console.log(`📍 Branch: ${branch.name} (${branch.city})`);
        console.log(`📦 Products: ${products.length}`);
        console.log(`📊 Inventory: ${inventoryCount} variants`);
        console.log('========================================\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
