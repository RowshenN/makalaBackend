const express = require("express");
const router = express.Router();

const {
  createArticle,
  getArticles,
  getArticleBySlug,
  updateArticle,
  deleteArticle,
  getLatestArticles,
  getThisWeekArticles,
  getArticleById,
} = require("../controllers/article.controller");
const { authorizeByPermission } = require("../middleware/authorizeByPermission");

router.get("/", authorizeByPermission("article:list"), getArticles);
router.get("/latest", authorizeByPermission("article:list"), getLatestArticles);
router.get("/this-week", authorizeByPermission("article:list"), getThisWeekArticles);
router.get("/id/:id", authorizeByPermission("article:view"), getArticleById);
router.get("/:slug", authorizeByPermission("article:view"), getArticleBySlug);

router.post("/", authorizeByPermission("article:create"), createArticle);
router.put("/:id", authorizeByPermission("article:update"), updateArticle);
router.delete("/:id", authorizeByPermission("article:delete"), deleteArticle);

module.exports = router;
