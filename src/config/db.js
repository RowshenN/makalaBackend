const { Sequelize } = require("sequelize");
const { DB_URL } = require("./env");

if (!DB_URL) {
  throw new Error("❌ DATABASE_URL is missing! Check your .env file and import order.");
}

const sequelize = new Sequelize(DB_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false 
    }
  },
  logging: false
});

module.exports = sequelize;