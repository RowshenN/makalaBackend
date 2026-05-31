const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET } = require("../config/env");
const RoutePermission = require("../models/routePermission.model");
const User = require("../models/user.model");

const cache = {
  data: new Map(),
  expiresAt: 0,
  TTL: 60 * 1000,
};

const loadCache = async () => {
  const all = await RoutePermission.findAll();
  cache.data = new Map(all.map((p) => [p.key, p.allowedRoles]));
  cache.expiresAt = Date.now() + cache.TTL;
};

const invalidateCache = () => {
  cache.expiresAt = 0;
};

const authorizeByPermission = (key) => async (req, res, next) => {
  try {
    if (Date.now() >= cache.expiresAt) {
      await loadCache();
    }

    const allowedRoles = cache.data.get(key);

    if (!allowedRoles) {
      return res
        .status(403)
        .json({ message: `Permission "${key}" is not configured` });
    }

    if (allowedRoles.includes("public")) {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    let payload;
    try {
      payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await User.findByPk(payload.id, {
      attributes: ["id", "email", "name", "role"],
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient permissions" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: "Authorization error", error: err.message });
  }
};

module.exports = { authorizeByPermission, invalidateCache };
