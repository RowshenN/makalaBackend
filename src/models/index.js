const Issue = require("./issue.model");
const Article = require("./article.model");
const Category = require("./category.model");
const Magazine = require("./magazine.model");
const Author = require("./author.model");
const User = require("./user.model");
const RefreshToken = require("./refreshToken.model");
const RoutePermission = require("./routePermission.model");

Issue.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Issue.belongsTo(Magazine, { foreignKey: "magazineId", as: "magazine" });

Article.belongsTo(Issue, { foreignKey: "issueId", as: "issue" });
Article.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Article.belongsTo(Author, { foreignKey: "authorId", as: "author" });

Category.hasMany(Issue, { foreignKey: "categoryId" });
Category.hasMany(Article, { foreignKey: "categoryId", as: "articles" });
Magazine.hasMany(Issue, { foreignKey: "magazineId" });
Issue.hasMany(Article, { foreignKey: "issueId", as: "articles" });
Author.hasMany(Article, { foreignKey: "authorId", as: "articles" });

User.hasMany(RefreshToken, { foreignKey: "userId", as: "refreshTokens" });
RefreshToken.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = {
  Issue,
  Article,
  Category,
  Magazine,
  Author,
  User,
  RefreshToken,
  RoutePermission,
};
