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
  getArticleById
} = require("../controllers/article.controller");

router.post("/", createArticle);
router.get("/", getArticles);

router.get("/latest", getLatestArticles);
router.get("/this-week", getThisWeekArticles);

// 🔥 SEO route
router.get("/id/:id", getArticleById);
router.get("/:slug", getArticleBySlug);

router.put("/:id", updateArticle);
router.delete("/:id", deleteArticle);

module.exports = router;
