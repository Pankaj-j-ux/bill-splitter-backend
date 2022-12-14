/** @format */

const jwt = require("jsonwebtoken");
const dbconnection = require("../Config/db_config");

const isLogedIn = async (req, res, next) => {
  try {
    // console.log(req);
    const token = req.cookies.token;

    // ||
    // req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      throw Error("not_loged_in");
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    let sqlQuery = `select id,uname,email,contact,photo1 from Users where email="${decoded.email}"`;
    let promise = new Promise((resolve, reject) => {
      dbconnection.query(sqlQuery, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const result = await promise;

    if (result.length === 0) {
      throw Error("User is not login !!");
    }

    req.user = result[0];

    next();
  } catch (err) {
    console.log("ERROR FROM IS_LOGED_IN :: ", err.message);
    console.log(err);

    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

module.exports = isLogedIn;
