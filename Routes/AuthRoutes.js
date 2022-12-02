/** @format */

const router = require("express").Router();

// Controllers ...
const { signup, login, logout } = require("../Controllers/AuthControllers");

// Routes Config ...
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);

module.exports = router;
