const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

router.post("/register", register); // HU01
router.post("/login", login);       // HU02

module.exports = router;
