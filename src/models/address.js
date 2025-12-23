import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    addressLine1: {
        type: String,
        required: true,
    },
    addressLine2: {
        type: String,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
        required: true,
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    label: {
        type: String,
        enum: ['Home', 'Office', 'Other'],
        default: 'Home',
    },
    labelCustom: {
        type: String,
        default: '',
    },
});

const Address = mongoose.model('Address', addressSchema);

export default Address;