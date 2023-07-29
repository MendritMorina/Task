const express = require("express");
const router = express.Router();

const { signup, login, myprofile } = require("../controllers/authController");
const authentication = require("../middlewares/authentication");

// POST /api/auth/signup
router.post("/signup", signup);

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/my-profile
router.get("/my-profile", authentication, myprofile);

module.exports = router;
