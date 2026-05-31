const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategoryById,
} = require("../controllers/category.controller");
const { authorizeByPermission } = require("../middleware/authorizeByPermission");

router.get("/", authorizeByPermission("category:list"), getCategories);
router.get("/:id", authorizeByPermission("category:view"), getCategoryById);

router.post("/", authorizeByPermission("category:create"), createCategory);
router.put("/:id", authorizeByPermission("category:update"), updateCategory);
router.delete("/:id", authorizeByPermission("category:delete"), deleteCategory);

module.exports = router;
