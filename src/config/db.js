const { Sequelize } = require("sequelize");
const { DB_URL } = require("./env");

const sequelize = new Sequelize(
  DB_URL,
  {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false 
      }
    },
    logging: false
  }
);

module.exports = sequelize;
