/** @format */

const mysql = require("mysql2");

const option = {
  host: "localhost",
  port: "3306",
  user: "root",
  password: "876627",
  database: "ducat",
};

const connection = mysql.createPool(option).promise();

module.exports = connection;
