const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { API_URL } = require("../config/config");

// ✅ ONLY FOR IMAGE UPLOAD (TipTap)
router.post("/", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const url = `${API_URL}upload/${req.file.filename}`;

    res.json({ url }); // ✅ IMPORTANT
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;
