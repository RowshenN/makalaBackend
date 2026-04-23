const { Category } = require("../models");

// ✅ CREATE
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Category.create({ name });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating category" });
  }
};

// ✅ GET ALL
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

// ✅ GET BY ID
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByPk(id);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  res.json(category);
};


// ✅ UPDATE
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = name || category.name;

    await category.save();

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error updating category" });
  }
};

// ✅ DELETE
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.destroy();

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category" });
  }
};
