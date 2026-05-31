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
const { authorizeByPermission } = require("../middleware/authorizeByPermission");

router.get("/", authorizeByPermission("issue:list"), getIssues);
router.get("/latest", authorizeByPermission("issue:list"), getLatestIssues);
router.get("/this-week", authorizeByPermission("issue:list"), getThisWeekIssue);
router.get("/:id", authorizeByPermission("issue:view"), getIssueById);

router.post(
  "/",
  authorizeByPermission("issue:create"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  createIssue
);
router.put(
  "/:id",
  authorizeByPermission("issue:update"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  updateIssue
);
router.delete("/:id", authorizeByPermission("issue:delete"), deleteIssue);

module.exports = router;
