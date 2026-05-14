const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Route: /api/search
// Use of GET because this endpoint only retrieves data 
// without modifying the database state. 
router.get('/', searchController.searchPosts);

module.exports = router;