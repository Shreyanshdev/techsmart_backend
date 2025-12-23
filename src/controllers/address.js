import Address from "../models/address.js";
import { Customer } from "../models/user.js";
import { geocodeAddress } from '../utils/geocode.js';
import {
    validateRequiredFields,
    validateCoordinates,
    validateNonEmptyString
} from '../utils/validators.js';

export const addAddress = async (req, res) => {
    try {
        // Get userId from authenticated user (from JWT token)
        const userId = req.user._id || req.user.userId;

        if (!userId) {
            return res.status(400).json({ message: "User ID not found in token" });
        }

        const { addressLine1, addressLine2, city, state, zipCode, isDefault, latitude, longitude, label, labelCustom } = req.body;

        // ===== INPUT VALIDATION =====
        try {
            // Validate required fields
            validateRequiredFields(req.body, ['addressLine1', 'city', 'state', 'zipCode']);

            // Validate string fields
            validateNonEmptyString(addressLine1, 'Address line 1');
            validateNonEmptyString(city, 'City');
            validateNonEmptyString(state, 'State');
            validateNonEmptyString(zipCode, 'Zip code');

            // Validate coordinates if provided
            if (latitude !== undefined && longitude !== undefined) {
                validateCoordinates(latitude, longitude);
            }
        } catch (validationError) {
            return res.status(400).json({
                message: validationError.message,
                error: 'VALIDATION_ERROR'
            });
        }
        // ===== END VALIDATION =====

        // If latitude and longitude are provided, use them; otherwise, geocode the address
        let finalLatitude = latitude || 0;
        let finalLongitude = longitude || 0;

        if (!latitude || !longitude) {
            // Build full address string for geocoding
            const addressString = [addressLine1, addressLine2, city, state, zipCode].filter(Boolean).join(', ');

            try {
                const geo = await geocodeAddress(addressString);
                finalLatitude = geo.latitude;
                finalLongitude = geo.longitude;
            } catch (geoErr) {
                console.warn("Geocoding failed, using provided coordinates or defaults:", geoErr.message);
                // Keep the provided coordinates or defaults (0,0)
            }
        }

        const newAddress = new Address({
            userId,
            addressLine1,
            addressLine2,
            city,
            state,
            zipCode,
            isDefault,
            latitude: finalLatitude,
            longitude: finalLongitude,
            label: label || 'Home',
            labelCustom: labelCustom || '',
        });

        await newAddress.save();

        // Add the address to the customer's address array
        await Customer.findByIdAndUpdate(userId, { $push: { address: newAddress._id } });

        return res.status(201).json({
            message: "Address added successfully",
            address: newAddress,
            coordinates: {
                latitude: finalLatitude,
                longitude: finalLongitude
            }
        });
    } catch (error) {
        console.error("Error adding address:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const getAddresses = async (req, res) => {
    try {
        // Get userId from authenticated user (from JWT token)
        const userId = req.user._id || req.user.userId;

        if (!userId) {
            return res.status(400).json({ message: "User ID not found in token" });
        }

        console.log(`📍 Fetching addresses for user: ${userId}`);

        const addresses = await Address.find({ userId });
        console.log(`📍 Found ${addresses.length} addresses for user ${userId}`);

        return res.status(200).json({
            message: "Addresses fetched successfully",
            addresses: addresses
        });
    } catch (error) {
        console.error("Error fetching addresses:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id || req.user.userId;
        const { addressLine1, addressLine2, city, state, zipCode, isDefault, latitude, longitude, label, labelCustom } = req.body;

        // ===== INPUT VALIDATION =====
        try {
            // Validate required fields
            validateRequiredFields(req.body, ['addressLine1', 'city', 'state', 'zipCode']);

            // Validate string fields
            validateNonEmptyString(addressLine1, 'Address line 1');
            validateNonEmptyString(city, 'City');
            validateNonEmptyString(state, 'State');
            validateNonEmptyString(zipCode, 'Zip code');

            // Validate coordinates if provided
            if (latitude !== undefined && longitude !== undefined) {
                validateCoordinates(latitude, longitude);
            }
        } catch (validationError) {
            return res.status(400).json({
                message: validationError.message,
                error: 'VALIDATION_ERROR'
            });
        }
        // ===== END VALIDATION =====

        // SECURITY: Verify address belongs to authenticated user
        const existingAddress = await Address.findById(id);
        if (!existingAddress) {
            return res.status(404).json({ message: "Address not found" });
        }
        if (existingAddress.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You are not authorized to update this address",
                error: "FORBIDDEN"
            });
        }

        // If latitude and longitude are provided, use them; otherwise, geocode the address
        let finalLatitude = latitude || 0;
        let finalLongitude = longitude || 0;

        if (!latitude || !longitude) {
            // Build full address string for geocoding
            const addressString = [addressLine1, addressLine2, city, state, zipCode].filter(Boolean).join(', ');

            try {
                const geo = await geocodeAddress(addressString);
                finalLatitude = geo.latitude;
                finalLongitude = geo.longitude;
            } catch (geoErr) {
                console.warn("Geocoding failed during update, using provided coordinates or defaults:", geoErr.message);
                // Keep the provided coordinates or defaults (0,0)
            }
        }

        const updatedAddress = await Address.findByIdAndUpdate(
            id,
            {
                addressLine1,
                addressLine2,
                city,
                state,
                zipCode,
                isDefault,
                latitude: finalLatitude,
                longitude: finalLongitude,
                label: label || 'Home',
                labelCustom: labelCustom || '',
            },
            { new: true }
        );

        return res.status(200).json({
            message: "Address updated successfully",
            address: updatedAddress,
            coordinates: {
                latitude: finalLatitude,
                longitude: finalLongitude
            }
        });
    } catch (error) {
        console.error("Error updating address:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id || req.user.userId;

        // SECURITY: Verify address belongs to authenticated user
        const address = await Address.findById(id);
        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }
        if (address.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You are not authorized to delete this address",
                error: "FORBIDDEN"
            });
        }

        await Address.findByIdAndDelete(id);

        // Remove the address from the customer's address array
        await Customer.findByIdAndUpdate(userId, { $pull: { address: id } });

        return res.status(200).json({ message: "Address deleted successfully" });
    } catch (error) {
        console.error("Error deleting address:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getAddressById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id || req.user.userId;

        const address = await Address.findById(id);
        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        // SECURITY: Verify address belongs to authenticated user
        if (address.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You are not authorized to view this address",
                error: "FORBIDDEN"
            });
        }

        return res.status(200).json(address);
    } catch (error) {
        console.error("Error fetching address by ID:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

