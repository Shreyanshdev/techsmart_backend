import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getAllCategories } from "../controllers/product/category.js";
import {
    getProductByCategoryId,
    getAllProducts,
    getProductById,
    searchProducts,
    getRelatedProducts,
    getAllTags,
    getAllBrands,
    getProductsByBrand,
    getBranchProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/product/product.js";

const router = express.Router();

// IMPORTANT: Specific routes MUST come before parameterized routes
// Otherwise /:productId will match everything

// Search and filter routes (must come first)
router.get("/search", searchProducts);
router.get("/tags", getAllTags);
router.get("/brands", getAllBrands);
router.get("/brand/:brandName", getProductsByBrand);

// Category routes (must come before /:productId)
router.get("/categories", getAllCategories);
router.get("/category/:categoryId", getProductByCategoryId);

// Branch-specific products
router.get("/branch/:branchId", getBranchProducts);

// Basic product routes
router.get("/", getAllProducts);

// Admin routes (protected)
router.post("/", verifyToken, createProduct);
router.put("/:productId", verifyToken, updateProduct);
router.delete("/:productId", verifyToken, deleteProduct);

// Parameterized routes MUST come last
router.get("/:productId/related", getRelatedProducts);
router.get("/:productId", getProductById);

export default router;