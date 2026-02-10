import SubCategory from "../../models/subcategory.js";

/**
 * Get all active subcategories with category populated
 */
export const getAllSubCategories = async (req, res) => {
    try {
        const subcategories = await SubCategory.find({ isActive: true })
            .populate('category', 'name image')
            .sort({ 'category': 1, order: 1 });
        return res.status(200).json(subcategories);
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Get subcategories by category ID
 */
export const getSubCategoriesByCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const subcategories = await SubCategory.find({
            category: categoryId,
            isActive: true
        })
            .populate('category', 'name image')
            .sort({ order: 1 });
        return res.status(200).json(subcategories);
    } catch (error) {
        console.error("Error fetching subcategories by category:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Get subcategories grouped by category (for Categories screen)
 */
export const getSubCategoriesGrouped = async (req, res) => {
    try {
        const subcategories = await SubCategory.find({ isActive: true })
            .populate('category', 'name image order')
            .sort({ order: 1 });

        // Group by category
        const grouped = {};
        subcategories.forEach(sub => {
            if (sub.category) {
                const catId = sub.category._id.toString();
                if (!grouped[catId]) {
                    grouped[catId] = {
                        category: sub.category,
                        subcategories: []
                    };
                }
                grouped[catId].subcategories.push({
                    _id: sub._id,
                    name: sub.name,
                    image: sub.image,
                    order: sub.order
                });
            }
        });

        // Convert to array and sort by category order
        const result = Object.values(grouped).sort((a, b) =>
            (a.category.order || 0) - (b.category.order || 0)
        );

        return res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching grouped subcategories:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Create a new subcategory (Admin)
 */
export const createSubCategory = async (req, res) => {
    const { name, category, description, image, order } = req.body;

    try {
        const subcategory = new SubCategory({
            name,
            category,
            description,
            image,
            order: order || 0
        });
        await subcategory.save();
        return res.status(201).json(subcategory);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Subcategory with this name already exists in this category" });
        }
        console.error("Error creating subcategory:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Update a subcategory (Admin)
 */
export const updateSubCategory = async (req, res) => {
    const { subcategoryId } = req.params;
    const updates = req.body;

    try {
        const subcategory = await SubCategory.findByIdAndUpdate(
            subcategoryId,
            updates,
            { new: true }
        ).populate('category', 'name image');

        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        return res.status(200).json(subcategory);
    } catch (error) {
        console.error("Error updating subcategory:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Delete a subcategory (Admin)
 */
export const deleteSubCategory = async (req, res) => {
    const { subcategoryId } = req.params;

    try {
        const subcategory = await SubCategory.findByIdAndDelete(subcategoryId);

        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        return res.status(200).json({ message: "Subcategory deleted successfully" });
    } catch (error) {
        console.error("Error deleting subcategory:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
