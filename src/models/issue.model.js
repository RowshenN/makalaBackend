const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Issue = sequelize.define("Issue", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
  },

  pageCount: {
    type: DataTypes.INTEGER,
  },

  image: {
    type: DataTypes.STRING, // URL
    allowNull: true,
  },

  year: {
    type: DataTypes.INTEGER,
  },

  week: {
    type: DataTypes.INTEGER,
  },

  pdf: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Issue;
