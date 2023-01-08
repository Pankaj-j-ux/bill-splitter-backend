/** @format */

const dbconnection = require("../Config/db_config");
const { generateCookie } = require("../Utilities/cookieUtils");
const { encryptPassword, isValidPass } = require("../Utilities/passUtils");

exports.signup = async (req, res, next) => {
  const { firstname, lastname, email, gender } = req.body;
  let { upassword } = req.body;
  // console.log(req.body);
  try {
    if (!(firstname && lastname && email && gender && upassword)) {
      throw Error("Credentials missing");
    }

    let sqlQuery = `select uname,email from Users where email="${email}"`;
    let promise = new Promise((resolve, reject) => {
      dbconnection.query(sqlQuery, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const result = await promise;
    console.log(result);
    if (result.length > 0) {
      throw Error("User already exist");
    }

    const uname = firstname + " " + lastname;
    upassword = await encryptPassword(upassword);
    // console.log(upassword);

    const user = {
      uname,
      gender,
      email,
      upassword,
    };

    const sqlQuery1 = `INSERT INTO Users SET ?`;

    const promise1 = new Promise((resolve, reject) => {
      dbconnection.query(sqlQuery1, user, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const result1 = await promise1;
    // console.log(result1)

    if (result1) {
      res.status(200).json({
        success: true,
        msg: "User registered",
        result1,
      });
    }
  } catch (err) {
    console.log("ERROR FROM SIGNUP :: ", err.message);
    console.log(err);

    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  const { email, upassword } = req.body;
  let {} = req.body;

  try {
    if (!(email && upassword)) {
      throw Error("credentials missing");
    }

    let sqlQuery = `select * from Users where email="${email}"`;
    let promise = new Promise((resolve, reject) => {
      dbconnection.query(sqlQuery, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const result = await promise;
    // console.log(result);
    if (result.length == 0) {
      throw Error("User doesn't exist. Please Sign Up first");
    }

    const isValid = await isValidPass(upassword, result[0].upassword);
    if (!isValid) {
      throw Error("Incorrect Credentials");
    }

    result[0].upassword = undefined;

    generateCookie(result[0], res);
  } catch (err) {
    console.log("ERROR FROM LOGIN :: ", err.message);
    console.log(err);

    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.status(200).cookie("token", "").json({
      success: true,
      msg: "Successfully logout",
    });
  } catch (err) {
    console.log("ERROR FROM LOGOUT :: ", err.message);
    console.log(err);

    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};
