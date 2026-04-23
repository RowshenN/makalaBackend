const express = require("express");
const router = express.Router();

const {
  createMagazine,
  getMagazines,
  updateMagazine,
  deleteMagazine,
  getMagazineById
} = require("../controllers/magazine.controller");

router.post("/", createMagazine);
router.get("/", getMagazines);
router.get("/:id", getMagazineById);
router.put("/:id", updateMagazine);
router.delete("/:id", deleteMagazine);

module.exports = router;
