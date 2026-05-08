// maps API endpoints to the controller functions

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// POST: /api/posts/create
router.post('/create', postController.createPost);

// PUT: /api/posts/update/:id
router.put('/update/:id', postController.updatePost);

// DELETE: /api/posts/delete/:id
router.delete('/delete/:id', postController.deletePost);

module.exports = router;