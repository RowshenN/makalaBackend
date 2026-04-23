const { Op } = require("sequelize");
const { Issue, Category, Magazine, Article } = require("../models");

// ✅ CREATE ISSUE
exports.createIssue = async (req, res) => {
  try {
    let {
      title,
      description,
      pageCount,
      year,
      week,
      categoryId,
      magazineId,
      articleIds,
    } = req.body;

    const image = req.files?.image
      ? `http://localhost:5000/upload/${req.files.image[0].filename}`
      : null;

    const pdf = req.files?.pdf
      ? `http://localhost:5000/upload/${req.files.pdf[0].filename}`
      : null;

    const issue = await Issue.create({
      title,
      description,
      pageCount: Number(pageCount),
      image,
      pdf,
      year: Number(year),
      week: Number(week),
      categoryId,
      magazineId,
    });

    // 🔥 FIX: normalize articleIds
    const ids = Array.isArray(articleIds)
      ? articleIds
      : articleIds
        ? [articleIds]
        : [];

    // 🔗 assign selected articles
    if (ids.length > 0) {
      await Article.update(
        { issueId: issue.id },
        { where: { id: { [Op.in]: ids } } },
      );
    }

    const issueWithArticles = await Issue.findByPk(issue.id, {
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        { model: Magazine, as: "magazine", attributes: ["id", "title"] },
        { model: Article, as: "articles" },
      ],
    });

    res.status(201).json(issueWithArticles);
  } catch (error) {
    console.error("🔥 FULL ERROR:", error);
    res.status(500).json({
      message: error.message,
      detail: error,
    });
  }
};

// ✅ GET ALL ISSUES (WITH RELATIONS)
exports.getIssues = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const { categoryId, magazineId, search } = req.query;

    let issueIds = [];

    // ✅ STEP 1: SEARCH LOGIC
    if (search) {
      // 1. Issues matching title/description
      const issuesFromFields = await Issue.findAll({
        attributes: ["id"],
        where: {
          [Op.or]: [
            { title: { [Op.iLike]: `%${search}%` } },
            { description: { [Op.iLike]: `%${search}%` } },
          ],
        },
      });

      // 2. Issues matching articles
      const issuesFromArticles = await Issue.findAll({
        attributes: ["id"],
        include: [
          {
            model: Article,
            as: "articles",
            required: true,
            where: {
              [Op.or]: [
                { slug: { [Op.iLike]: `%${search}%` } },
                { content: { [Op.iLike]: `%${search}%` } },
              ],
            },
          },
        ],
      });

      // 🔥 merge IDs (remove duplicates)
      const idsSet = new Set([
        ...issuesFromFields.map((i) => i.id),
        ...issuesFromArticles.map((i) => i.id),
      ]);

      issueIds = Array.from(idsSet);
    }

    // ✅ STEP 2: MAIN QUERY
    const where = {};

    if (categoryId) where.categoryId = categoryId;
    if (magazineId) where.magazineId = magazineId;

    if (search) {
      where.id = {
        [Op.in]: issueIds.length
          ? issueIds
          : ["00000000-0000-0000-0000-000000000000"], // avoid empty IN
      };
    }

    const { rows, count } = await Issue.findAndCountAll({
      where,
      limit,
      offset,
      distinct: true,

      include: [
        {
          model: Article,
          as: "articles",
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: Magazine,
          as: "magazine",
          attributes: ["id", "title"],
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    res.json({
      data: rows,
      total: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching issues" });
  }
};

// ✅ GET SINGLE ISSUE
exports.getIssueById = async (req, res) => {
  try {
    const { id } = req.params;

    const issue = await Issue.findByPk(id, {
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        { model: Magazine, as: "magazine", attributes: ["id", "title"] },
        { model: Article, as: "articles" },
      ],
    });

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: "Error fetching issue" });
  }
};

// ✅ UPDATE ISSUE
exports.updateIssue = async (req, res) => {
  try {
    const { id } = req.params;

    let {
      title,
      description,
      pageCount,
      year,
      week,
      categoryId,
      magazineId,
      articleIds,
    } = req.body;

    const issue = await Issue.findByPk(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // 🖼️ handle image
    let image = issue.image;
    let pdf = issue.pdf;

    if (req.files?.image) {
      image = `http://localhost:5000/upload/${req.files.image[0].filename}`;
    }

    if (req.files?.pdf) {
      pdf = `http://localhost:5000/upload/${req.files.pdf[0].filename}`;
    }


    if (req.body.removeImage === "true") image = null;
    if (req.body.removePdf === "true") pdf = null;

    // 📝 update issue fields
    await issue.update({
      title,
      description,
      pageCount: Number(pageCount),
      year: Number(year),
      week: Number(week),
      categoryId,
      magazineId,
      image,
      pdf
    });

    // 🔥 FIX: normalize articleIds (FormData safe)
    const ids = Array.isArray(articleIds)
      ? articleIds
      : articleIds
        ? [articleIds]
        : [];

    // 🔗 STEP 1: remove ALL existing article relations
    await Article.update({ issueId: null }, { where: { issueId: id } });

    // 🔗 STEP 2: assign selected articles
    if (ids.length > 0) {
      await Article.update(
        { issueId: id },
        { where: { id: { [Op.in]: ids } } },
      );
    }

    // 🔄 return updated issue with relations
    const issueWithArticles = await Issue.findByPk(issue.id, {
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        { model: Magazine, as: "magazine", attributes: ["id", "title"] },
        { model: Article, as: "articles" }, // ✅ correct alias
      ],
    });

    res.json(issueWithArticles);
  } catch (error) {
    console.error("🔥 UPDATE ISSUE ERROR:", error);
    res.status(500).json({ message: "Error updating issue" });
  }
};

// ✅ DELETE
exports.deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;

    const issue = await Issue.findByPk(id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    await issue.destroy();

    res.json({ message: "Issue deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting issue" });
  }
};

exports.getLatestIssues = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    const { categoryId } = req.query;

    const where = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const issues = await Issue.findAll({
      where, // ✅ ADD THIS
      order: [["createdAt", "DESC"]],
      limit,
      include: [
        {
          model: Article,
          as: "articles",
        },
        {
          model: Magazine,
          as: "magazine",
          attributes: ["id", "title"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    });

    res.json(issues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching latest issues" });
  }
};

exports.getThisWeekIssue = async (req, res) => {
  try {
    const now = new Date();

    const year = now.getFullYear();

    // 🔥 get week number
    const firstDay = new Date(year, 0, 1);
    const days = Math.floor((now - firstDay) / (24 * 60 * 60 * 1000));
    const week = Math.ceil((days + firstDay.getDay() + 1) / 7);

    const issue = await Issue.findOne({
      where: { year, week },
      include: [
        {
          model: Article,
          as: "articles",
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!issue) {
      return res.status(404).json({ message: "No issue for this week" });
    }

    res.json(issue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching this week issue" });
  }
};
