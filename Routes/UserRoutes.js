/** @format */

const router = require("express").Router();

// Controllers ...
const { dashboard } = require("../Controllers/UserControllers");
const isLogedIn = require("../Middlewares/isLogedIn");

// Routes Config ...
router.route("/dashboard").get(isLogedIn, dashboard);

module.exports = router;
