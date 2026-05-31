const express = require("express");
const router = express.Router();

const { getUsers, updateUser, deleteUser } = require("../controllers/user.controller");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const adminOnly = [authenticate, authorize("admin")];

router.get("/", ...adminOnly, getUsers);
router.put("/:id", ...adminOnly, updateUser);
router.delete("/:id", ...adminOnly, deleteUser);

module.exports = router;
