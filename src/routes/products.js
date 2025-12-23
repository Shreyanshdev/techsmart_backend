import express from 'express';
import { getAllCategories } from "../controllers/product/category.js";
import {
    getProductByCategoryId,
    getAllProducts,
    getProductById,
    searchProducts,
    getRelatedProducts,
    getFeaturedProducts,
    getSubscriptionAvailableProducts,
    getAllTags,
    getAllBrands
} from "../controllers/product/product.js";

const router = express.Router();

// IMPORTANT: Specific routes MUST come before parameterized routes
// Otherwise /:productId will match everything

// Search and filter routes (must come first)
router.get("/search", searchProducts);
router.get("/tags", getAllTags);
router.get("/brands", getAllBrands);

// Special product collections (must come before /:productId)
router.get("/featured", getFeaturedProducts);
router.get("/subscription-available", getSubscriptionAvailableProducts);

// Category routes (must come before /:productId)
router.get("/categories", getAllCategories);
router.get("/category/:categoryId", getProductByCategoryId);

// Basic product routes
router.get("/", getAllProducts);

// Parameterized routes MUST come last
router.get("/:productId/related", getRelatedProducts);
router.get("/:productId", getProductById);

export default router;