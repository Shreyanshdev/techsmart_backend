import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getAllCategories } from "../controllers/product/category.js";
import {
    getAllSubCategories,
    getSubCategoriesByCategory,
    getSubCategoriesGrouped,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory
} from "../controllers/product/subcategory.js";
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
    deleteProduct,
    getProductsFeed
} from "../controllers/product/product.js";

const router = express.Router();

// IMPORTANT: Specific routes MUST come before parameterized routes
// Otherwise /:productId will match everything

// ===== OPTIMIZED FEED ENDPOINT (Cursor-based pagination) =====
// This is the primary endpoint for app home/category screens
router.get("/feed", getProductsFeed);

// Search and filter routes (must come first)
router.get("/search", searchProducts);
router.get("/tags", getAllTags);
router.get("/brands", getAllBrands);
router.get("/brand/:brandName", getProductsByBrand);

// Category routes (must come before /:productId)
router.get("/categories", getAllCategories);
router.get("/category/:categoryId", getProductByCategoryId);

// Subcategory routes
router.get("/subcategories", getAllSubCategories);
router.get("/subcategories/grouped", getSubCategoriesGrouped);
router.get("/subcategories/:categoryId", getSubCategoriesByCategory);
router.post("/subcategories", verifyToken, createSubCategory);
router.put("/subcategories/:subcategoryId", verifyToken, updateSubCategory);
router.delete("/subcategories/:subcategoryId", verifyToken, deleteSubCategory);

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