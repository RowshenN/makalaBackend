const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Author = sequelize.define("Author", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  worksAt: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  studiesAt: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Author;
