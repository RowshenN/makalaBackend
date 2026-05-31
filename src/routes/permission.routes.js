const express = require("express");
const router = express.Router();

const {
  getPermissions,
  getPermissionByKey,
  updatePermission,
} = require("../controllers/permission.controller");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const adminOnly = [authenticate, authorize("admin")];

router.get("/", ...adminOnly, getPermissions);
router.get("/:key", ...adminOnly, getPermissionByKey);
router.put("/:key", ...adminOnly, updatePermission);

module.exports = router;
