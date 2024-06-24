
const mysql = require("mysql2");

const option = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DB,
  connectionLimit: 10,
};

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DB,
  // authSwitchHandler: function ({ pluginName, pluginData }, cb) {
  //   if (pluginName === 'caching_sha2_password') {
  //     // Use mysql_native_password as the authentication plugin
  //     cb(null, Buffer.from([1]));
  //   } else {
  //     cb(new Error(`Unsupported auth plugin: ${pluginName}`));
  //   }
  // }
});

connection.connect(function(err) {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected as id ' + connection.threadId);
});

module.exports = connection;
