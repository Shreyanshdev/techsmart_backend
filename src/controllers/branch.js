import Branch from "../models/branch.js";

export const addBranch = async (req, res) => {
    try {
        const { name, address, location } = req.body;
        const newBranch = new Branch({
            name,
            address,
            location, // { latitude: Number, longitude: Number }
        });
        await newBranch.save();
        return res.status(201).json({ message: "Branch created successfully", branch: newBranch });
    } catch (error) {
        console.error("Error creating branch:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getBranches = async (req, res) => {
    try {
        const branches = await Branch.find();
        return res.status(200).json(branches);
    } catch (error) {
        console.error("Error fetching branches:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Haversine formula for calculating distance between two coordinates (in km)
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Find nearest branch based on customer location
export const getNearestBranch = async (req, res) => {
    try {
        const { latitude, longitude } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                error: "Latitude and longitude are required"
            });
        }

        const customerLat = parseFloat(latitude);
        const customerLon = parseFloat(longitude);

        console.log(`[getNearestBranch] Customer location: lat=${customerLat}, lng=${customerLon}`);

        const branches = await Branch.find();
        if (!branches || branches.length === 0) {
            return res.status(404).json({
                success: false,
                error: "No branches found"
            });
        }

        let nearestBranch = null;
        let shortestDistance = Infinity;

        for (const branch of branches) {
            // Handle both GeoJSON format (coordinates: [lng, lat]) and legacy format (latitude, longitude)
            let branchLat = null;
            let branchLon = null;

            // Try GeoJSON format first
            if (branch.location?.coordinates && branch.location.coordinates.length >= 2) {
                branchLon = branch.location.coordinates[0];
                branchLat = branch.location.coordinates[1];
            }
            // Fall back to legacy format
            else if (branch.location?.latitude && branch.location?.longitude) {
                branchLat = branch.location.latitude;
                branchLon = branch.location.longitude;
            }

            if (branchLat && branchLon) {
                const distance = calculateHaversineDistance(
                    customerLat,
                    customerLon,
                    branchLat,
                    branchLon
                );
                console.log(`[getNearestBranch] Branch "${branch.name}": lat=${branchLat}, lng=${branchLon}, distance=${distance.toFixed(2)}km`);

                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    nearestBranch = branch;
                }
            } else {
                console.warn(`[getNearestBranch] Branch "${branch.name}" has no valid location data`);
            }
        }

        if (!nearestBranch) {
            // Fall back to first branch if distance calculation fails
            console.warn('[getNearestBranch] No branch with valid location found, using fallback');
            nearestBranch = branches[0];
            shortestDistance = Infinity;
        }

        // Get the branch's delivery radius (default to 30km if not set)
        const deliveryRadiusKm = nearestBranch.deliveryRadiusKm || 30;
        const isWithinRadius = shortestDistance !== Infinity && shortestDistance <= deliveryRadiusKm;

        console.log(`[getNearestBranch] Result: branch="${nearestBranch.name}", distance=${shortestDistance.toFixed(2)}km, radius=${deliveryRadiusKm}km, isWithinRadius=${isWithinRadius}`);

        return res.status(200).json({
            success: true,
            branch: nearestBranch,
            distance: shortestDistance !== Infinity ? shortestDistance : null,
            deliveryRadiusKm: deliveryRadiusKm,
            isWithinRadius: isWithinRadius
        });
    } catch (error) {
        console.error("Error finding nearest branch:", error);
        return res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Get branch by pincode (using Google Geocoding to convert pincode to coordinates)
export const getBranchByPincode = async (req, res) => {
    try {
        const { pincode } = req.params;

        if (!pincode || pincode.length !== 6) {
            return res.status(400).json({
                success: false,
                error: "Valid 6-digit pincode is required"
            });
        }

        // Use Google Geocoding API to get coordinates from pincode
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            // Fallback: return first/default branch if no API key
            const defaultBranch = await Branch.findOne();
            return res.status(200).json({
                success: true,
                branch: defaultBranch,
                distance: null,
                message: "Using default branch (geocoding unavailable)"
            });
        }

        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${pincode},India&key=${apiKey}`;

        let latitude, longitude;
        try {
            const fetch = (await import('node-fetch')).default;
            const geocodeResponse = await fetch(geocodeUrl);
            const geocodeData = await geocodeResponse.json();

            if (geocodeData.status === 'OK' && geocodeData.results.length > 0) {
                const location = geocodeData.results[0].geometry.location;
                latitude = location.lat;
                longitude = location.lng;
            } else {
                return res.status(400).json({
                    success: false,
                    error: "Could not find location for this pincode"
                });
            }
        } catch (geocodeErr) {
            console.error("Geocoding error:", geocodeErr);
            // Fallback to default branch
            const defaultBranch = await Branch.findOne();
            return res.status(200).json({
                success: true,
                branch: defaultBranch,
                distance: null,
                message: "Using default branch (geocoding failed)"
            });
        }

        // Now find nearest branch using the coordinates
        const branches = await Branch.find();

        let nearestBranch = null;
        let shortestDistance = Infinity;

        for (const branch of branches) {
            if (branch.location?.latitude && branch.location?.longitude) {
                const distance = calculateHaversineDistance(
                    latitude,
                    longitude,
                    branch.location.latitude,
                    branch.location.longitude
                );
                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    nearestBranch = branch;
                }
            }
        }

        if (!nearestBranch) {
            nearestBranch = branches[0];
            shortestDistance = Infinity;
        }

        const deliveryRadiusKm = nearestBranch.deliveryRadiusKm || 30;
        const isWithinRadius = shortestDistance !== Infinity && shortestDistance <= deliveryRadiusKm;

        return res.status(200).json({
            success: true,
            branch: nearestBranch,
            distance: shortestDistance !== Infinity ? shortestDistance : null,
            pincode,
            deliveryRadiusKm,
            isWithinRadius
        });
    } catch (error) {
        console.error("Error finding branch by pincode:", error);
        return res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Get default branch (for cases where location cannot be determined)
export const getDefaultBranch = async (req, res) => {
    try {
        // Return the first/primary branch as default
        const defaultBranch = await Branch.findOne().sort({ createdAt: 1 });

        if (!defaultBranch) {
            return res.status(404).json({
                success: false,
                error: "No branches available"
            });
        }

        return res.status(200).json({
            success: true,
            branch: defaultBranch,
            isDefault: true
        });
    } catch (error) {
        console.error("Error fetching default branch:", error);
        return res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};



