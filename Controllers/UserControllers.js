/** @format */

const dbconnection = require("../Config/db_config");

exports.dashboard = async (req, res, next) => {
  try {
    const user = req.user;

    let sqlQuery = `select Group_info.id, Group_info.gname ,Group_info.Created_at from  Group_info  inner join User_groups on Group_info.id =User_groups.gid where uid= ${user.id}`;
    let promise = new Promise((resolve, reject) => {
      dbconnection.query(sqlQuery, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const result = await promise;
    console.log("YAHA PER", result);

    // const date = new Date(result[1].Created_at).toDateString();
    // console.log(date);

    res.status(200).json({
      success: true,
      user,
      groups: result,
    });
  } catch (err) {
    console.log("ERROR FROM DASHBOARD :: ", err.message);
    console.log(err);

    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};
