const RoutePermission = require("../models/routePermission.model");
const { invalidateCache } = require("../middleware/authorizeByPermission");

const getPermissions = async (req, res) => {
  try {
    const permissions = await RoutePermission.findAll({
      order: [
        ["resource", "ASC"],
        ["action", "ASC"],
      ],
    });
    res.json(permissions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch permissions", error: err.message });
  }
};

const getPermissionByKey = async (req, res) => {
  try {
    const permission = await RoutePermission.findOne({
      where: { key: req.params.key },
    });

    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }

    res.json(permission);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch permission", error: err.message });
  }
};

const updatePermission = async (req, res) => {
  try {
    const { allowedRoles } = req.body;

    if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
      return res
        .status(400)
        .json({ message: "allowedRoles must be a non-empty array" });
    }

    const valid = ["public", "admin", "editor", "viewer"];
    const invalid = allowedRoles.filter((r) => !valid.includes(r));
    if (invalid.length > 0) {
      return res
        .status(400)
        .json({ message: `Invalid roles: ${invalid.join(", ")}. Valid: ${valid.join(", ")}` });
    }

    const permission = await RoutePermission.findOne({
      where: { key: req.params.key },
    });

    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }

    await permission.update({ allowedRoles });

    invalidateCache();

    res.json({ message: "Permission updated", permission });
  } catch (err) {
    res.status(500).json({ message: "Failed to update permission", error: err.message });
  }
};

module.exports = { getPermissions, getPermissionByKey, updatePermission };
