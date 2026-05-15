const express = require("express");
const router = express.Router();

const { getPosts, createPost, getTags, deletePost, updatePost, getPost, getComments, createComment } = require("../controllers/postController")

router.get("/", getPosts);
router.post("/", createPost);
router.get("/tags/all", getTags);
router.delete("/:postId", deletePost);
router.put("/:postId", updatePost);
router.get("/:postId", getPost);
router.get("/:postId/comments", getComments);
router.post("/:postId/comments", createComment);

module.exports = router;