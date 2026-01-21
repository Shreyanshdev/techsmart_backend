import mongoose from "mongoose";

/**
 * Branch Model (with Store functionality merged)
 * Represents a physical store/warehouse location with GeoJSON for geospatial queries
 */
const branchSchema = new mongoose.Schema({
    // Branch Identification
    branchId: {
        type: String,
        unique: true,
        sparse: true,
        description: "Unique branch identifier (e.g., BRANCH_KANPUR_001)"
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    // Location Details
    city: {
        type: String,
        index: true
    },
    address: {
        type: String
    },
    pincode: {
        type: String,
        index: true
    },

    // GeoJSON Location for 2dsphere index (upgraded from simple lat/lng)
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            description: "GeoJSON coordinates [lng, lat]"
        },
        // Keep backward compatibility with old format
        latitude: { type: Number },
        longitude: { type: Number }
    },

    // Branch Configuration
    status: {
        type: String,
        enum: ['active', 'inactive', 'maintenance'],
        default: 'active',
        index: true
    },
    deliveryRadiusKm: {
        type: Number,
        default: 5,
        description: "Delivery radius in kilometers"
    },

    // Operating Hours
    operatingHours: {
        monday: { open: String, close: String },
        tuesday: { open: String, close: String },
        wednesday: { open: String, close: String },
        thursday: { open: String, close: String },
        friday: { open: String, close: String },
        saturday: { open: String, close: String },
        sunday: { open: String, close: String }
    },

    // Staff & Partners
    deliveryPartners: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryPartner"
    }],

    // Contact Information
    phone: String,
    email: String,

    // Metadata
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// GeoJSON 2dsphere index for location-based queries
branchSchema.index({ 'location': '2dsphere' });

// Compound indexes
branchSchema.index({ city: 1, status: 1 });
branchSchema.index({ status: 1, isActive: 1 });

// Virtual for backward compatibility - get latitude
branchSchema.virtual('lat').get(function () {
    // Try GeoJSON first, fall back to old format
    if (this.location?.coordinates?.[1]) return this.location.coordinates[1];
    if (this.location?.latitude) return this.location.latitude;
    return null;
});

// Virtual for backward compatibility - get longitude
branchSchema.virtual('lng').get(function () {
    // Try GeoJSON first, fall back to old format
    if (this.location?.coordinates?.[0]) return this.location.coordinates[0];
    if (this.location?.longitude) return this.location.longitude;
    return null;
});

// Static method to find branches near a location
branchSchema.statics.findNearby = async function (longitude, latitude, maxDistanceKm = 10) {
    return this.find({
        'location.coordinates': {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                },
                $maxDistance: maxDistanceKm * 1000 // Convert to meters
            }
        },
        status: 'active',
        isActive: true
    });
};

// Pre-save hook to handle location format and generate branchId
branchSchema.pre('save', async function (next) {
    // Convert old lat/lng format to GeoJSON if needed
    if (this.location?.latitude && this.location?.longitude && !this.location?.coordinates) {
        this.location.type = 'Point';
        this.location.coordinates = [this.location.longitude, this.location.latitude];
    }

    // Generate branchId if new
    if (this.isNew && !this.branchId) {
        const cityCode = (this.city || 'DEFAULT').toUpperCase().replace(/\s+/g, '_').substring(0, 10);
        const count = await mongoose.model('Branch').countDocuments({ city: this.city });
        this.branchId = `BRANCH_${cityCode}_${(count + 1).toString().padStart(3, '0')}`;
    }
    next();
});

const Branch = mongoose.model("Branch", branchSchema);
export default Branch;