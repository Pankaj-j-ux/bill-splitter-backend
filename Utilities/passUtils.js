/** @format */

const bcrypt = require("bcrypt");

exports.encryptPassword = async (pass) => {
  const salt = await bcrypt.genSalt(parseInt(process.env.BCJS_SALT));
  return bcrypt.hash(pass, salt);
};

exports.isValidPass = async (enteredPass, currPass) => {
  return await bcrypt.compare(enteredPass, currPass);
};
