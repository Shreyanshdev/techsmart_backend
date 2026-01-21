/**
 * Create Admin Script
 * Run: node scripts/createAdmin.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Admin } from '../src/models/user.js';

dotenv.config();

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: 'admin@takesmart.com' });
        if (existingAdmin) {
            console.log('ℹ️ Admin already exists:', existingAdmin.email);
            process.exit(0);
        }

        // Create new admin
        const admin = new Admin({
            name: 'Admin',
            email: 'admin@takesmart.com',
            password: 'Admin@123', // Will be hashed by pre-save hook
            role: 'Admin',
            isActivated: true
        });

        await admin.save();
        console.log('✅ Admin created successfully!');
        console.log('📧 Email: admin@takesmart.com');
        console.log('🔐 Password: Admin@123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
