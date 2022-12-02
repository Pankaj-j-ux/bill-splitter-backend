/** @format */

const mysql = require("mysql");

const option = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DB,
  connectionLimit: 10,
};

try {
  const pool = mysql.createPool(option);
  module.exports = pool;
} catch (err) {
  console.log("ERROR FROM DB_CONFIG :: ", err.message);
  console.log(err);

  res.status(500).json({
    success: false,
    msg: err.message,
  });
}

// try {
// const connection = mysql.createConnection(option);

// connection.connect((err) => {
//   if (err) {
//     throw err;
//   } else {
//     console.log(
//       `DB_CONNECTED ~ PORT@${process.env.DB_PORT} ~ endpoint@${process.env.DB_HOST}...`
//     );
//   }
// });

// module.exports = connection;
// } catch (err) {
//   console.log("ERROR FROM DB_CONFIG :: ", err.message);
//   console.log(err);
// }
