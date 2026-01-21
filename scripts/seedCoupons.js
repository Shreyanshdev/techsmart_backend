/**
 * Seed Coupons Script - Creates test coupon data
 * Run: node scripts/seedCoupons.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Coupon } from '../src/models/coupon.js';

dotenv.config();

const seedCoupons = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Define test coupons
        const couponsData = [
            {
                code: 'WELCOME50',
                description: 'Welcome offer - ₹50 off on your first order',
                discountType: 'fixed',
                discountValue: 50,
                minOrderValue: 200,
                maxDiscountAmount: null,
                usageLimit: 1000,
                userLimit: 1,
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
                isActive: true
            },
            {
                code: 'SAVE20',
                description: '20% off on orders above ₹500',
                discountType: 'percentage',
                discountValue: 20,
                minOrderValue: 500,
                maxDiscountAmount: 200, // Max ₹200 discount
                usageLimit: null, // Unlimited
                userLimit: 3,
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
                isActive: true
            },
            {
                code: 'FLAT100',
                description: 'Flat ₹100 off on orders above ₹1000',
                discountType: 'fixed',
                discountValue: 100,
                minOrderValue: 1000,
                maxDiscountAmount: null,
                usageLimit: 500,
                userLimit: 2,
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                isActive: true
            },
            {
                code: 'MEGA30',
                description: 'Mega discount - 30% off (max ₹300)',
                discountType: 'percentage',
                discountValue: 30,
                minOrderValue: 800,
                maxDiscountAmount: 300,
                usageLimit: 200,
                userLimit: 1,
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
                isActive: true
            },
            {
                code: 'FREEDELIVERY',
                description: 'Free delivery on any order',
                discountType: 'fixed',
                discountValue: 40, // Assuming delivery fee is ~₹40
                minOrderValue: 0,
                maxDiscountAmount: null,
                usageLimit: null,
                userLimit: 5,
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
                isActive: true
            }
        ];

        let created = 0;
        let existing = 0;

        for (const couponData of couponsData) {
            const exists = await Coupon.findOne({ code: couponData.code });
            if (!exists) {
                await Coupon.create(couponData);
                console.log(`✅ Created coupon: ${couponData.code}`);
                created++;
            } else {
                console.log(`ℹ️ Coupon already exists: ${couponData.code}`);
                existing++;
            }
        }

        console.log('\n========================================');
        console.log('🎉 COUPON SEED COMPLETE!');
        console.log('========================================');
        console.log(`✅ Created: ${created} coupons`);
        console.log(`ℹ️ Existing: ${existing} coupons`);
        console.log('========================================');
        console.log('\nTest Coupons:');
        console.log('  WELCOME50  - ₹50 off (min ₹200)');
        console.log('  SAVE20     - 20% off (min ₹500, max ₹200)');
        console.log('  FLAT100    - ₹100 off (min ₹1000)');
        console.log('  MEGA30     - 30% off (min ₹800, max ₹300)');
        console.log('  FREEDELIVERY - ₹40 off (no min)');
        console.log('========================================\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding coupons:', error);
        process.exit(1);
    }
};

seedCoupons();
