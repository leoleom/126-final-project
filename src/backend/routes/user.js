const express = require("express");
const router = express.Router();

const { getUserPosts, getUserDrafts, getUserProfile } = require("../controllers/userController");

router.get("/:userId/posts", getUserPosts);
router.get("/:userId/drafts", getUserDrafts);
router.put("/:userId", getUserProfile);

module.exports = router;
