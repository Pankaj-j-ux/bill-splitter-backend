/** @format */

const router = require("express").Router();

// Controllers ...
const { getData } = require("../Controllers/AuthControllers");

// Routes Config ...
router.route("/getdata").get(getData);

module.exports = router;
