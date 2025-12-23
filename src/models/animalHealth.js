import mongoose from "mongoose";

// ===== SUB-SCHEMAS =====

// Rumination record for Cow Health tracking
const ruminationRecordSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    hours: { type: Number, required: true, description: "Rumination hours" },
    threshold: { type: Number, default: 6, description: "Threshold in hours" }
}, { _id: false });

// Diet record for Cow Diet tracking
const dietRecordSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    wheatStraw: { type: Number, default: 0, description: "Wheat Straw in Kg" },
    greenFodder: { type: Number, default: 0, description: "Green Fodder in Kg" },
    brokenWheat: { type: Number, default: 0, description: "Broken Wheat in Kg" },
    mustardCake: { type: Number, default: 0, description: "Mustard Cake in Kg" },
    chickpeaBran: { type: Number, default: 0, description: "Chickpea Bran in Kg" },
    totalGrainPart: { type: Number, default: 0, description: "Total Grain Part in Kg" },
    extraNutrition: { type: String, description: "Extra Nutrition (e.g., Jaggery)" }
}, { _id: false });

// Milk Quality record
const milkQualityRecordSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    fatPercentage: { type: Number, description: "Daily average fat %" },
    snf: { type: Number, description: "Solid Not Fat %" },
    protein: { type: Number, description: "Protein %" }
}, { _id: false });

// Calf Information
const calfInfoSchema = new mongoose.Schema({
    gender: { type: String, enum: ['male', 'female'] },
    dateOfBirth: { type: Date },
    name: { type: String }
}, { _id: false });

// Physical Characteristics
const physicalCharacteristicsSchema = new mongoose.Schema({
    heightCm: { type: Number, description: "Height in cm" },
    bodyLengthCm: { type: Number, description: "Body Length in cm" },
    weightKg: { type: Number, description: "Weight in Kg" },
    numberOfHorns: { type: Number, default: 2 },
    visibleCharacteristics: { type: String, description: "e.g., Convex forehead" },
    colour: { type: String, description: "e.g., Brownish-red in colour" }
}, { _id: false });

// Parturition (Reproduction) Info
const parturitionInfoSchema = new mongoose.Schema({
    numberOfParturition: { type: String, description: "e.g., 2nd time" },
    ageAtFirstParturitionMonths: { type: String, description: "e.g., 29-44 months" },
    parturitionIntervalMonths: { type: String, description: "e.g., 14-18 months" }
}, { _id: false });

// Milk Production Info
const milkProductionInfoSchema = new mongoose.Schema({
    yieldPerLactationKg: { type: String, description: "e.g., 1200-2700 Kg" },
    averageFatPercentage: { type: Number, description: "e.g., 2.80%" }
}, { _id: false });

// Animal Habits & Preferences
const habitsAndPreferencesSchema = new mongoose.Schema({
    habits: { type: String, description: "Behavioral habits and personality" },
    likeWeather: { type: String, description: "Preferred weather conditions" },
    likeFood: { type: String, description: "Preferred food types" }
}, { _id: false });

// ===== MAIN SCHEMA =====
const animalHealthSchema = new mongoose.Schema({
    // Link to product (for breed association) - KEPT AS REQUIRED
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
        description: "Reference to the product this animal provides"
    },

    // ===== KNOW YOUR COW SECTION =====
    // Breed Information
    breedName: {
        type: String,
        required: true,
        description: "Animal breed name (e.g., Sahiwal, Jersey, Holstein, Murrah)"
    },
    origin: {
        type: String,
        description: "Origin of the breed (e.g., The Sahiwal originated in the dry Punjab region)"
    },
    mainUse: {
        type: String,
        description: "Main use of the animal (e.g., Food - Milk; Work - Draught)"
    },
    synonyms: {
        type: String,
        description: "Other names for the breed (e.g., Lambi Bar, Lola, Montgomery, Multani, and Teli)"
    },
    breedingTract: {
        type: String,
        description: "Breeding regions (e.g., Ferozpur and Amritsar districts of Punjab)"
    },
    adaptabilityToEnvironment: {
        type: String,
        description: "How well adapted to agro-climatic conditions"
    },

    // Animal identification
    animalName: {
        type: String,
        description: "Name or ID of the animal"
    },
    animalTag: {
        type: String,
        unique: true,
        sparse: true,
        description: "Unique tag/identifier for the animal"
    },
    imageUrl: {
        type: String,
        description: "Photo of the animal"
    },

    // Age (stored as string like "53 Months (as of Sep 2024)")
    age: {
        type: String,
        description: "Age of the animal (e.g., 53 Months as of Sep 2024)"
    },

    // Physical Characteristics
    physicalCharacteristics: {
        type: physicalCharacteristicsSchema,
        description: "Physical attributes of the animal"
    },

    // Calf Information
    calfInfo: {
        type: calfInfoSchema,
        description: "Information about the cow's current calf"
    },

    // Management & Mobility
    managementSystem: {
        type: String,
        enum: ['intensive', 'semi-intensive', 'extensive', 'free-range'],
        description: "Management system (e.g., Semi-Intensive)"
    },
    mobility: {
        type: String,
        enum: ['stationary', 'mobile', 'migratory'],
        description: "Mobility type (e.g., Stationary)"
    },

    // Feeding Info (for Adults)
    feedingOfAdults: {
        type: String,
        description: "Feeding type for adults (e.g., Grazing and Concentrate)"
    },

    // Parturition (Reproduction) Info
    parturitionInfo: {
        type: parturitionInfoSchema,
        description: "Reproduction information"
    },

    // Milk Production Info
    milkProductionInfo: {
        type: milkProductionInfoSchema,
        description: "Milk production statistics"
    },

    // Habits and Preferences
    habitsAndPreferences: {
        type: habitsAndPreferencesSchema,
        description: "Behavioral habits and preferences"
    },

    // ===== COW HEALTH SECTION =====
    // Health metrics
    healthScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 85,
        description: "Overall health score (0-100)"
    },
    lastVetCheckup: {
        type: Date,
        description: "Date of last veterinary checkup"
    },
    nextVetCheckup: {
        type: Date,
        description: "Scheduled date for next checkup"
    },
    vaccinationStatus: {
        type: String,
        enum: ['up-to-date', 'due-soon', 'overdue', 'unknown'],
        default: 'up-to-date',
        description: "Current vaccination status"
    },
    vaccinations: [{
        name: { type: String },
        date: { type: Date },
        nextDue: { type: Date }
    }],

    // Rumination Records (Cow Health -> Rumination chart)
    ruminationRecords: {
        type: [ruminationRecordSchema],
        description: "Daily rumination hours tracking"
    },

    // ===== COW DIET SECTION =====
    dietRecords: {
        type: [dietRecordSchema],
        description: "Daily diet intake records"
    },

    // ===== MILK QUALITY SECTION =====
    milkQualityRecords: {
        type: [milkQualityRecordSchema],
        description: "Daily milk quality records (fat, snf, protein)"
    },

    // Current/Latest Fat and SNF content for quick access (displayed in header)
    fatContent: {
        type: Number,
        default: 0,
        description: "Current fat content percentage (for display in header)"
    },
    snfContent: {
        type: Number,
        default: 0,
        description: "Current SNF (Solid Not Fat) content percentage (for display in header)"
    },

    // ===== PROCESS SECTION =====
    processingInfo: {
        type: String,
        description: "Information about milk processing methods"
    },

    // ===== COMPANION SECTION =====
    companionInfo: {
        type: String,
        description: "Information about companion animals or caretakers"
    },

    // Additional notes
    notes: {
        type: String,
        description: "Additional health notes or observations"
    },

    // Status
    isActive: {
        type: Boolean,
        default: true,
        description: "Whether this animal is currently active"
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes
animalHealthSchema.index({ productId: 1 });
animalHealthSchema.index({ breedName: 1 });
animalHealthSchema.index({ isActive: 1 });
// Note: animalTag already has unique index from field definition
animalHealthSchema.index({ 'ruminationRecords.date': 1 });
animalHealthSchema.index({ 'dietRecords.date': 1 });
animalHealthSchema.index({ 'milkQualityRecords.date': 1 });

// Pre-save hook to update timestamp
animalHealthSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const AnimalHealth = mongoose.model("AnimalHealth", animalHealthSchema);
export default AnimalHealth;
