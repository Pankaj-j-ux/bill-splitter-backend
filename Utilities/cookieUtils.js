/** @format */

const { getJwt } = require("./jwtUtils");

exports.generateCookie = async (data, res) => {
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  };

  const jwttoken = await getJwt(data);
  //   console.log(jwttoken)

  res.status(200).cookie("token", jwttoken, options).json({
    success: true,
    jwttoken,
    data,
    msg: "Successfully login",
  });
};
