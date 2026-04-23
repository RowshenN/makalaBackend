const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  getLatestIssues,
  getThisWeekIssue,
} = require("../controllers/issue.controller");

router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  createIssue,
);
router.get("/", getIssues);
router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  updateIssue,
);

router.delete("/:id", deleteIssue);

router.get("/latest", getLatestIssues); // ?limit=4 or 10
router.get("/this-week", getThisWeekIssue); // single issue
router.get("/:id", getIssueById);

module.exports = router;
