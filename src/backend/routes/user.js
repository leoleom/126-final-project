const express = require("express");
const router = express.Router();

const { getUserPosts, getUserDrafts, getUserProfile, uploadAvatar, upload } = require("../controllers/userController");

router.get("/:userId/posts", getUserPosts);
router.get("/:userId/drafts", getUserDrafts);
router.put("/:userId", getUserProfile);
router.post("/:userId/avatar", upload.single("avatar"), uploadAvatar);

module.exports = router;