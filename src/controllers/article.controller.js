const { Article, Issue, Category, Author, Magazine } = require("../models");
const { Op } = require("sequelize");

// 🔥 helper → slug generator
const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

// ✅ CREATE ARTICLE
exports.createArticle = async (req, res) => {
  try {
    const { title, content, issueId, categoryId, authorId } = req.body;

    const slug = slugify(title);

    const article = await Article.create({
      title,
      slug,
      content,
      issueId,
      categoryId,
      authorId,
    });

    res.status(201).json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating article" });
  }
};

// ✅ GET ALL ARTICLES

exports.getArticles = async (req, res) => {
  try {
    const { search, categoryId, year, week, magazineId } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const where = {};
    const issueWhere = {};

    if (search) {
      where.title = {
        [Op.iLike]: `%${search}%`,
      };
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (year) {
      issueWhere.year = year;
    }

    if (week) {
      issueWhere.week = week;
    }

    if (magazineId) {
      issueWhere.magazineId = magazineId;
    }

    const { count, rows } = await Article.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        {
          model: Issue,
          as: "issue", // ✅ FIX
          where: Object.keys(issueWhere).length ? issueWhere : undefined,
          attributes: ["id", "title", "year", "week"],
          include: [
            {
              model: Magazine,
              as: "magazine", // ✅ also needed (you used alias here too)
              attributes: ["id", "title"],
            },
          ],
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: Author,
          as: "author",
          attributes: ["id", "firstName", "lastName", "worksAt", "studiesAt"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error filtering articles" });
  }
};

// ✅ GET ARTICLE BY ID
exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Requested ID:", id); // 👈 ADD THIS

    const article = await Article.findByPk(id);

    console.log("Found article:", article); // 👈 ADD THIS

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching article" });
  }
};

// ✅ GET SINGLE ARTICLE (by slug 🔥)
exports.getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const article = await Article.findOne({
      where: { slug },
      include: [
        {
          model: Issue,
          as: "issue",
          attributes: ["id", "title", "year", "week"],
        },
        { model: Category, as: "category", attributes: ["id", "name"] },
        {
          model: Author,
          as: "author",
          attributes: ["id", "firstName", "lastName", "worksAt", "studiesAt"],
        },
      ],
    });

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json(article);
  } catch (error) {
    res.status(500).json({ message: "Error fetching article" });
  }
};

// ✅ UPDATE
exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findByPk(id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const { title, content, categoryId, authorId, issueId } = req.body;

    // 🔥 handle image
    let image = article.image;

    if (req.file) {
      image = `http://localhost:5000/upload/${req.file.filename}`;
    }

    if (req.body.removeImage === "true") {
      image = null;
    }

    // 🔥 update fields safely
    await article.update({
      title: title ?? article.title,
      content: content ?? article.content,
      categoryId: categoryId ?? article.categoryId,
      authorId: authorId ?? article.authorId,
      issueId: issueId ?? article.issueId,
      image,
      slug: title ? slugify(title) : article.slug,
    });

    res.json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating article" });
  }
};

// ✅ DELETE
exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findByPk(id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    await article.destroy();

    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting article" });
  }
};

exports.getThisWeekArticles = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const currentWeek = Math.ceil(
      ((new Date() - new Date(currentYear, 0, 1)) / 86400000 + 1) / 7,
    );

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Article.findAndCountAll({
      limit,
      offset,
      include: [
        {
          model: Issue,
          as: "issue", // ✅ FIX
          where: {
            year: currentYear,
            week: currentWeek,
          },
        },
      ],
    });

    res.json({
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching this week articles" });
  }
};

exports.getLatestArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Article.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        { model: Issue, as: "issue" },
        { model: Category, as: "category", attributes: ["id", "name"] },
        { model: Author, as: "author" },
      ],
    });

    res.json({
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching latest articles" });
  }
};
