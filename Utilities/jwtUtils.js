/** @format */
const jwt = require("jsonwebtoken");

exports.getJwt = async (data) => {
  return await jwt.sign(
    { id: data.id, email: data.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXP,
    }
  );
};

exports.decodeJwt = async (token) => {
  return await jwt.verify(token, process.env.JWT_SECRET);
};
