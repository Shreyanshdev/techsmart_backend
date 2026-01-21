import { Customer, DeliveryPartner } from "../models/user.js";
import Inventory from "../models/inventory.js";

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('Decoded userId:', userId);

    const user = await Customer.findById(userId).lean();
    console.log('User found:', user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      isActivated: user.isActivated,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, address } = req.body;

    const user = await Customer.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;

    await user.save();

    return res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getDeliveryPartnerById = async (req, res) => {
  try {
    const { id } = req.params;
    const deliveryPartner = await DeliveryPartner.findById(id).select('-password'); // Exclude password

    if (!deliveryPartner) {
      return res.status(404).json({ message: "Delivery Partner not found" });
    }

    return res.status(200).json(deliveryPartner);
  } catch (error) {
    console.error("Get delivery partner by ID error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, inventoryId } = req.body;
    const itemToToggle = inventoryId || productId;

    const user = await Customer.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const index = user.wishlist.indexOf(itemToToggle);
    if (index === -1) {
      user.wishlist.push(itemToToggle);
    } else {
      user.wishlist.splice(index, 1);
    }

    await user.save();
    return res.json({ message: "Wishlist updated", wishlist: user.wishlist });
  } catch (error) {
    console.error("Wishlist toggle error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { branchId } = req.query;

    const user = await Customer.findById(userId).populate({
      path: 'wishlist',
      populate: { path: 'product' }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const wishlistedInventories = user.wishlist.filter(item => item && item.product);

    const enrichedProducts = wishlistedInventories.map(inventory => {
      const productObj = inventory.product.toObject ? inventory.product.toObject() : inventory.product;
      const invObj = inventory.toObject ? inventory.toObject() : inventory;

      return {
        ...productObj,
        variants: [{
          _id: invObj._id,
          inventoryId: invObj._id,
          variant: invObj.variant,
          pricing: invObj.pricing,
          stock: invObj.stock,
          isAvailable: invObj.isAvailable
        }]
      };
    });

    return res.json(enrichedProducts);
  } catch (error) {
    console.error("Wishlist fetch error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};