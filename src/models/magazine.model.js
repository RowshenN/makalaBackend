const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Magazine = sequelize.define("Magazine", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Magazine;
