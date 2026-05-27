const express = require("express");
const router = express.Router();

const { login, signup, changePassword } = require("../controllers/authController");

router.post("/login", login);
router.post("/signup", signup);
router.post("/change-password", changePassword);

module.exports = router;