const logger = require('../Config/logger.js');
const { addCategoryToDb, deleteCategoryById,getAllCategoriesFromDb }=require('../Models/categoryModel.js');
// Add a new category for single product

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const newCategoryId = await addCategoryToDb(name); // Corrected function name
    res.status(201).json({ message: 'Category added successfully', id: newCategoryId });
  } catch (err) {
    logger.error('Error adding category:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteCategoryById(id);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    logger.error('Error deleting category:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Get all categories
const getAllCategories = async (req, res) => {
    try {
      const categories = await getAllCategoriesFromDb();
      res.status(200).json({ categories });
    } catch (err) {
      logger.error('Error fetching categories:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports ={
  getAllCategories,
  deleteCategory,
  addCategory
};