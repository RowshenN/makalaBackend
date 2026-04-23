const { Magazine } = require("../models");

// ✅ CREATE
exports.createMagazine = async (req, res) => {
  try {
    const { title } = req.body;

    const magazine = await Magazine.create({ title });

    res.status(201).json(magazine);
  } catch (error) {
    res.status(500).json({ message: "Error creating magazine" });
  }
};

// ✅ GET ALL
exports.getMagazines = async (req, res) => {
  try {
    const magazines = await Magazine.findAll();

    res.json(magazines);
  } catch (error) {
    res.status(500).json({ message: "Error fetching magazines" });
  }
};

// ✅ GET SINGLE MAGAZINE
exports.getMagazineById = async (req, res) => {
  try {
    const { id } = req.params;

    const magazine = await Magazine.findByPk(id);

    if (!magazine) {
      return res.status(404).json({ message: "Magazine not found" });
    }

    res.json(magazine);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching magazine" });
  }
};

// ✅ UPDATE
exports.updateMagazine = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const magazine = await Magazine.findByPk(id);

    if (!magazine) {
      return res.status(404).json({ message: "Magazine not found" });
    }

    magazine.title = title || magazine.title;

    await magazine.save();

    res.json(magazine);
  } catch (error) {
    res.status(500).json({ message: "Error updating magazine" });
  }
};

// ✅ DELETE
exports.deleteMagazine = async (req, res) => {
  try {
    const { id } = req.params;

    const magazine = await Magazine.findByPk(id);

    if (!magazine) {
      return res.status(404).json({ message: "Magazine not found" });
    }

    await magazine.destroy();

    res.json({ message: "Magazine deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting magazine" });
  }
};
