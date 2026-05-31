const express = require("express");
const router = express.Router();

const {
  createAuthor,
  getAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/author.controller");
const { authorizeByPermission } = require("../middleware/authorizeByPermission");

router.get("/", authorizeByPermission("author:list"), getAuthors);
router.get("/:id", authorizeByPermission("author:view"), getAuthorById);

router.post("/", authorizeByPermission("author:create"), createAuthor);
router.put("/:id", authorizeByPermission("author:update"), updateAuthor);
router.delete("/:id", authorizeByPermission("author:delete"), deleteAuthor);

module.exports = router;
