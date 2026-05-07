// connects URL path to the controller function

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// When a POST request hits /api/auth/login, run the loginUser function
router.post('/login', authController.loginUser);

module.exports = router;