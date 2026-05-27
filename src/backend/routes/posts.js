const express = require("express");
const router = express.Router();

const { getPosts, 
        createPost, 
        getTags, 
        deletePost, 
        updatePost, 
        getPost, 
        getComments, 
        createComment,
        toggleBookmark,
        incrementPostView,
        reportPost,
        toggleVote } = require("../controllers/postController")

router.get("/", getPosts);
router.post("/", createPost);
router.get("/tags/all", getTags);

router.delete("/:postId", deletePost);
router.put("/:postId", updatePost);

router.get("/:postId", getPost);
router.get("/:postId/comments", getComments);

router.post("/:postId/comments", createComment);
router.post("/:postId/bookmark", toggleBookmark);
router.post("/:postId/vote", toggleVote);
router.post("/:postId/report", reportPost);
router.patch("/:postId/view", incrementPostView);


module.exports = router;