const express = require("express");
const router = express.Router();

const { getUserPosts, getUserDrafts, getUserProfile, updateUserProfile, getUserBookmarks, getUserNotifications, markNotificationsAsRead, uploadAvatar, upload } = require("../controllers/userController");

router.get("/:userId", getUserProfile);
router.get("/:userId/posts", getUserPosts);
router.get("/:userId/drafts", getUserDrafts);
router.get("/:userId/bookmarks", getUserBookmarks);
router.get("/:userId/notifications", getUserNotifications);

router.put("/:userId", updateUserProfile);
router.post("/:userId/avatar", upload.single("avatar"), uploadAvatar);
router.patch("/:userId/notifications/read", markNotificationsAsRead);

module.exports = router;