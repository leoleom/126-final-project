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
        toggleVote } = require("../controllers/postController")

router.get("/", getPosts);
router.post("/", createPost);
router.get("/tags/all", getTags);
router.delete("/:postId", deletePost);
router.put("/:postId", updatePost);
router.get("/:postId", getPost);
router.get("/:postId/comments", getComments);
router.post("/:postId/comments", createComment);
router.post("/:postId/vote", toggleVote);

module.exports = router;