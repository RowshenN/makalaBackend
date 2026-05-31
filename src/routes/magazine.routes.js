const express = require("express");
const router = express.Router();

const {
  createMagazine,
  getMagazines,
  updateMagazine,
  deleteMagazine,
  getMagazineById,
} = require("../controllers/magazine.controller");
const { authorizeByPermission } = require("../middleware/authorizeByPermission");

router.get("/", authorizeByPermission("magazine:list"), getMagazines);
router.get("/:id", authorizeByPermission("magazine:view"), getMagazineById);

router.post("/", authorizeByPermission("magazine:create"), createMagazine);
router.put("/:id", authorizeByPermission("magazine:update"), updateMagazine);
router.delete("/:id", authorizeByPermission("magazine:delete"), deleteMagazine);

module.exports = router;
