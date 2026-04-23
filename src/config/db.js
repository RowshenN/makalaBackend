const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "magazine",     // database namee
  "postgres",     // username
  "5432",     // password
  {
    host: "localhost",
    dialect: "postgres",
  }
);

module.exports = sequelize;
