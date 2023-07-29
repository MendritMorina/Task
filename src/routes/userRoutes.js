const express = require("express");
const router = express.Router();

const { signup, login, myprofile } = require("../controllers/authController");
const authentication = require("../middlewares/authentication");

router.post("/signup", signup);
router.post("/login", login);
router.get("/my-profile", authentication, myprofile);

module.exports = router;
