import mongoose, { Mongoose } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    role: {
        type: String,
        enum: ['Customer', 'Admin', 'DeliveryPartner'],
        required: true,
    },
    isActivated: {
        type: Boolean,
        default: false,
    }
})

const customerSchema = new mongoose.Schema({
    ...userSchema.obj,
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
    }],
    liveLocation: {
        latitude: { type: Number },
        longitude: { type: Number },
    },
    role: {
        type: String,
        enum: ['Customer'],
        default: 'Customer',
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
    },
    // Security features
    lastLogin: {
        type: Date,
    },
}, {
    timestamps: true,
});

const deliveryPartnerSchema = new mongoose.Schema({
    ...userSchema.obj,
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    liveLocation: {
        latitude: { type: Number },
        longitude: { type: Number },
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
    },
    role: {
        type: String,
        enum: ['DeliveryPartner'],
        default: 'DeliveryPartner',
    },
    // Security features
    failedLoginAttempts: {
        type: Number,
        default: 0,
    },
    accountLocked: {
        type: Boolean,
        default: false,
    },
    lockUntil: {
        type: Date,
    },
    lastLogin: {
        type: Date,
    },
    passwordChangedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

// Pre-save hook to hash password before saving (for create operations)
deliveryPartnerSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Check if password is already hashed (starts with $2b$ which is bcrypt hash format)
        if (this.password.startsWith('$2b$') || this.password.startsWith('$2a$')) {
            console.log('Password already hashed, skipping hash operation');
            return next();
        }

        // Hash the password with bcrypt (salt rounds = 10)
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

        // Update passwordChangedAt timestamp
        this.passwordChangedAt = new Date();

        console.log('✅ Password hashed successfully (HOOK: save) for delivery partner:', this.email);
        next();
    } catch (error) {
        console.error('❌ Error hashing password (HOOK: save):', error);
        next(error);
    }
});

// Pre-update hook to hash password before updating (for AdminJS and update operations)
deliveryPartnerSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();

    // Check if password is being updated
    if (update.password || (update.$set && update.$set.password)) {
        const password = update.password || update.$set.password;

        // Check if password is already hashed
        if (password.startsWith('$2b$') || password.startsWith('$2a$')) {
            console.log('Password already hashed in update, skipping hash operation');
            return next();
        }

        try {
            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Update the password in the update object
            if (update.$set) {
                update.$set.password = hashedPassword;
                update.$set.passwordChangedAt = new Date();
            } else {
                update.password = hashedPassword;
                update.passwordChangedAt = new Date();
            }

            console.log('✅ Password hashed successfully (HOOK: findOneAndUpdate) in update operation');
            next();
        } catch (error) {
            console.error('❌ Error hashing password (HOOK: findOneAndUpdate):', error);
            next(error);
        }
    } else {
        next();
    }
});

// Also handle updateOne operations
deliveryPartnerSchema.pre('updateOne', async function (next) {
    const update = this.getUpdate();

    if (update.password || (update.$set && update.$set.password)) {
        const password = update.password || update.$set.password;

        if (password.startsWith('$2b$') || password.startsWith('$2a$')) {
            console.log('Password already hashed in updateOne, skipping hash operation');
            return next();
        }

        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            if (update.$set) {
                update.$set.password = hashedPassword;
                update.$set.passwordChangedAt = new Date();
            } else {
                update.password = hashedPassword;
                update.passwordChangedAt = new Date();
            }

            console.log('✅ Password hashed successfully (HOOK: updateOne) in updateOne operation');
            next();
        } catch (error) {
            console.error('❌ Error hashing password (HOOK: updateOne):', error);
            next(error);
        }
    } else {
        next();
    }
});

const adminSchema = new mongoose.Schema({
    ...userSchema.obj,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Admin'],
        default: 'Admin',
    },
});

// Pre-save hook to hash admin password before saving
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Check if password is already hashed
        if (this.password.startsWith('$2b$') || this.password.startsWith('$2a$')) {
            console.log('Admin password already hashed, skipping hash operation');
            return next();
        }

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

        console.log('✅ Admin password hashed successfully (HOOK: save) for:', this.email);
        next();
    } catch (error) {
        console.error('❌ Error hashing admin password (HOOK: save):', error);
        next(error);
    }
});

// Pre-update hook to hash admin password before updating
adminSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    if (update.password || (update.$set && update.$set.password)) {
        const password = update.password || update.$set.password;
        if (password.startsWith('$2b$') || password.startsWith('$2a$')) {
            console.log('Admin password already hashed in update, skipping hash operation');
            return next();
        }
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            if (update.$set) {
                update.$set.password = hashedPassword;
            } else {
                update.password = hashedPassword;
            }
            console.log('✅ Admin password hashed successfully (HOOK: findOneAndUpdate) in update operation');
            next();
        } catch (error) {
            console.error('❌ Error hashing admin password (HOOK: findOneAndUpdate):', error);
            next(error);
        }
    } else {
        next();
    }
});

adminSchema.pre('updateOne', async function (next) {
    const update = this.getUpdate();
    if (update.password || (update.$set && update.$set.password)) {
        const password = update.password || update.$set.password;
        if (password.startsWith('$2b$') || password.startsWith('$2a$')) {
            console.log('Admin password already hashed in updateOne, skipping hash operation');
            return next();
        }
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            if (update.$set) {
                update.$set.password = hashedPassword;
            } else {
                update.password = hashedPassword;
            }
            console.log('✅ Admin password hashed successfully (HOOK: updateOne) in updateOne operation');
            next();
        } catch (error) {
            console.error('❌ Error hashing admin password (HOOK: updateOne):', error);
            next(error);
        }
    } else {
        next();
    }
});

export const Customer = mongoose.model('Customer', customerSchema);
export const DeliveryPartner = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
export const Admin = mongoose.model('Admin', adminSchema);
export const User = mongoose.model('User', userSchema);