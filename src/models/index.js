const Issue = require("./issue.model");
const Article = require("./article.model");
const Category = require("./category.model");
const Magazine = require("./magazine.model");
const Author = require("./author.model");

// 🔗 Issue relations
Issue.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});

Issue.belongsTo(Magazine, {
  foreignKey: "magazineId",
  as: "magazine",
});

// 🔗 Article relations
Article.belongsTo(Issue, {
  foreignKey: "issueId",
  as: "issue",
});

Article.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});

Article.belongsTo(Author, {
  foreignKey: "authorId",
  as: "author",
});

// optional (reverse relations)
Category.hasMany(Issue, { foreignKey: "categoryId" });
Category.hasMany(Article, {
  foreignKey: "categoryId",
  as: "articles",
});

Magazine.hasMany(Issue, { foreignKey: "magazineId" });

Issue.hasMany(Article, {
  foreignKey: "issueId",
  as: "articles",
});

Author.hasMany(Article, {
  foreignKey: "authorId",
  as: "articles",
});

module.exports = {
  Issue,
  Article,
  Category,
  Magazine,
  Author,
};
