const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const RoutePermission = sequelize.define("RoutePermission", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  resource: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  action: {
    type: DataTypes.ENUM("list", "view", "create", "update", "delete"),
    allowNull: false,
  },

  allowedRoles: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: ["admin"],
    validate: {
      isValidRoles(value) {
        const valid = ["public", "admin", "editor", "viewer"];
        const invalid = value.filter((r) => !valid.includes(r));
        if (invalid.length > 0) {
          throw new Error(`Invalid roles: ${invalid.join(", ")}`);
        }
      },
    },
  },

  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = RoutePermission;
