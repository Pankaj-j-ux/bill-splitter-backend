/** @format */

const bcrypt = require("bcryptjs");

exports.encryptPassword = async (pass) => {
  const salt = await bcrypt.genSaltSync(parseInt(process.env.BCJS_SALT));
  return bcrypt.hash(pass, salt);
};

exports.isValidPass = async (enteredPass, currPass) => {
  return await bcrypt.compareSync(enteredPass, currPass);
};
