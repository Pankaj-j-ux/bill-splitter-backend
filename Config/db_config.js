/** @format */

const mysql = require("mysql2");

const option = {
  host: "database-2.cm7rr30wspjm.ap-south-1.rds.amazonaws",
  port: "3306",
  user: "admin",
  password: "8766270178",
  database: "database-2",
};

const connection = mysql.createPool(option).promise();

module.exports = connection;
