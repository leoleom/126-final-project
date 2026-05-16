const express = require("express");
const router = express.Router();

const {
    getAdminDashboardData,
    getReportedPosts,
    resolveReportKeepPost,
    resolveReportHidePost,
    resolveReportDeletePost,
    getPendingAnonymousPosts,
    approveAnonymousPost,
    rejectAnonymousPost,
    getAdminUsers,
} = require("../controllers/adminController");

// dashboard
router.get("/dashboard", getAdminDashboardData);

// reported posts
router.get("/reports", getReportedPosts);
router.patch("/reports/:reportId/keep", resolveReportKeepPost);
router.patch("/reports/:reportId/hide/:postId", resolveReportHidePost);
router.patch("/reports/:reportId/delete/:postId", resolveReportDeletePost);

// anonymous posts
router.get("/anonymous", getPendingAnonymousPosts);
router.patch("/anonymous/:postId/approve", approveAnonymousPost);
router.patch("/anonymous/:postId/reject", rejectAnonymousPost);

// admin users
router.get("/users", getAdminUsers);

module.exports = router;