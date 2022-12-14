/** @format */

const router = require("express").Router();

// Controllers ...
const {
  dashboard,
  creategroup,
  groupdetail,
  addmember,
  changegroupname,
  addexpense,
  getprofiledata,
} = require("../Controllers/UserControllers");
const isLogedIn = require("../Middlewares/isLogedIn");

// Routes Config ...
router.route("/dashboard").get(isLogedIn, dashboard);
router.route("/creategroup").post(isLogedIn, creategroup);
router.route("/dashboard/:gid").get(isLogedIn, groupdetail);
router.route("/addmember/:gid").post(isLogedIn, addmember);
router.route("/changegroupname/:gid").post(isLogedIn, changegroupname);
router.route("/addexpense/:gid").post(isLogedIn, addexpense);

router.route("/getprofile").get(isLogedIn, getprofiledata);

module.exports = router;
