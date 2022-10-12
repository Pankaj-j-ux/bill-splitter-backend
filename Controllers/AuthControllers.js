/** @format */

const pool = require("../Config/db_config");

exports.getData = async (req, res, next) => {
  try {
    const query = "SELECT * FROM `Users`";

    const result = await pool.query(pool);
    console.log("result", result);
  } catch (err) {
    console.log("ERROR UNIT");
    console.log(err.message);
  }
};
