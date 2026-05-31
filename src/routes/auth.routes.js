const express = require("express");
const router = express.Router();

const { register, login, refresh, logout, me } = require("../controllers/auth.controller");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

router.post("/register", authenticate, authorize("admin"), register);

router.post("/login", login);

router.post("/refresh", refresh);

router.post("/logout", logout);

router.get("/me", authenticate, me);

module.exports = router;
