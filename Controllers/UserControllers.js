/** @format */

const { compareSync } = require("bcryptjs");
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
    // console.log("YAHA PER", result);

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

exports.creategroup = async (req, res, next) => {
  const groupname = req.body.gname;
  console.log(groupname);
  try {
    if (!groupname) {
      throw Error("No data present");
    }
    let sqlQuery = `insert into Group_info(gname,admin1) values("${groupname}", "${req.user.id}");`;
    let promise = new Promise((resolve, reject) => {
      dbconnection.query(sqlQuery, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const result = await promise;

    sqlQuery = `Select * from Group_info where id = ${result.insertId}`;
    promise = new Promise((resolve, reject) => {
      dbconnection.query(sqlQuery, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const result2 = await promise;

    sqlQuery = `insert into User_groups(uid,gid) values("${req.user.id}","${result.insertId}");`;
    promise = new Promise((resolve, reject) => {
      dbconnection.query(sqlQuery, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const result3 = await promise;

    // console.log("FROM CREATE GROUP", result2);

    res.status(200).json({
      success: true,
      newgroup: result2,
    });
  } catch (err) {
    console.log("ERROR FROM CREATE GROUP :: ", err.message);
    console.log(err);

    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

exports.changegroupname = async (req, res, next) => {
  try {
    const gname = req.body.groupName;
    const gid = req.params.gid;

    if (!gname) {
      throw Error("New Group Name is required");
    }

    let sqlQuery = `Update Group_info SET gname = "${gname}" WHERE id = ${gid};`;
    let promise = new Promise((resolve, reject) => {
      dbconnection.query(sqlQuery, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const result = await promise;
  } catch (err) {
    console.log("ERROR FROM CHANGE GROUP NAME :: ", err.message);
    console.log(err);

    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

exports.groupdetail = async (req, res, next) => {
  try {
    const gid = req.params.gid;
    const user = req.user.id;

    // let sqlQuery = `SELECT admin1 from Group_info WHERE id = ${gid};`;
    // let promise = new Promise((resolve, reject) => {
    //   dbconnection.query(sqlQuery, (err, result) => {
    //     if (err) reject(err);
    //     else resolve(result);
    //   });
    // });

    // const groupAdmin = await promise;

    let sqlQuery = `SELECT User_groups.uid, Users.uname, Users.gender, Users.email, Users.contact, Users.photo1 from User_groups INNER JOIN Users ON User_groups.uid = Users.id WHERE User_groups.gid = ${gid};`;
    let promise = new Promise((resolve, reject) => {
      dbconnection.query(sqlQuery, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const groupMembers = await promise;

    sqlQuery = `SELECT * from Group_info WHERE id = ${gid};`;
    promise = new Promise((resolve, reject) => {
      dbconnection.query(sqlQuery, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const group = await promise;

    // sqlQuery = `select sum(amn) as totalexpense from Bills where paidgid = ${gid}`;
    // promise = new Promise((resolve, reject) => {
    //   dbconnection.query(sqlQuery, (err, result) => {
    //     if (err) reject(err);
    //     else resolve(result);
    //   });
    // });

    // const totalExpense = await promise;

    // sqlQuery = `select userid,sum(splitamount) as individualexpense ,Users.uname, Users.email, Users.photo1 from Ubills inner join Users on Ubills.userid = Users.id where groupid=${gid} group by userid;`;
    // promise = new Promise((resolve, reject) => {
    //   dbconnection.query(sqlQuery, (err, result) => {
    //     if (err) reject(err);
    //     else resolve(result);
    //   });
    // });

    // const expenseOfIndividuals = await promise;

    sqlQuery = `select Users.id,Users.uname,Users.photo1,sum(Bills.amn) as groupTotalExpense,(select sum(amn) from Bills where paidgid=${gid} and paidby=${user}) as myTotalExpense from Bills inner join Users on Bills.paidby=Users.id where paidgid=${gid} GROUP BY Users.id;`;
    promise = new Promise((resolve, reject) => {
      dbconnection.query(sqlQuery, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const totalExpenseWithMy = await promise;

    sqlQuery = `select Users.uname, Users.email, Users.contact, Users.contact, Users.photo1, Bills.id, category, disc, paidby, amn,Bills.Created_at from Bills inner join Users on Bills.paidby=Users.id where Bills.paidgid=${gid};`;
    promise = new Promise((resolve, reject) => {
      dbconnection.query(sqlQuery, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const billHistory = await promise;

    sqlQuery = `select u.id,u.uname,u.email,u.contact,u.photo1,sum(distinct(Ubills.splitamount)) as owe from Ubills  inner join Users on Ubills.userid = Users.id inner join Users u on Ubills.paidto=u.id where groupid=${gid} and paid=false and userid=${user}  group by Ubills.paidto;`;
    promise = new Promise((resolve, reject) => {
      dbconnection.query(sqlQuery, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const oweData = await promise;

    sqlQuery = `select Users.id,Users.uname,Users.email,Users.contact,Users.photo1,sum(distinct(splitamount)) as lent from Ubills inner join Users on Ubills.userid = Users.id where groupid=${gid} and paidto=${user} and paid=false group by userid;`;
    promise = new Promise((resolve, reject) => {
      dbconnection.query(sqlQuery, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const lentData = await promise;

    oweData.forEach((oweobj, oweindex) => {
      let oweuser = oweobj.id;
      let oweamount = oweobj.owe;

      lentData.forEach((lentobj, lentindex) => {
        let lentuser = lentobj.id;
        let lentamount = lentobj.lent;

        if (oweuser === lentuser) {
          let newamount = oweamount - lentamount;
          if (newamount > 0) {
            oweData[oweindex].owe = +newamount;
            lentData[lentindex].lent = 0;
          }
          if (newamount < 0) {
            // newLentData = [...newLentData, { ...lentobj, lent: -newamount }];
            oweData[oweindex].owe = 0;
            lentData[lentindex].lent = -newamount;
          }
        }
      });
    });

    res.status(200).json({
      success: true,
      group: group,
      groupMembers: groupMembers,
      // totalExpense: totalExpense[0].totalexpense,
      // IndividualsExpense: expenseOfIndividuals,
      totalExpenseWithMy: totalExpenseWithMy[0],
      billHistory: billHistory.reverse(),
      oweData: oweData,
      lentData: lentData,
    });
  } catch (err) {
    console.log("ERROR FROM GROUP DETAIL :: ", err.message);
    console.log(err);

    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

exports.addmember = async (req, res, next) => {
  try {
    const gid = req.params.gid;
    const { newuser } = req.body;

    if (!newuser) {
      throw Error("Please Enter User ID properly");
    }

    let sqlQuery = `select uname,email, contact, gender,photo1,id  from Users where email="${newuser}"`;
    let promise = new Promise((resolve, reject) => {
      dbconnection.query(sqlQuery, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const result = await promise;
    // console.log(result);
    if (result.length === 0) {
      throw Error("User Does not exist. Please enter vaild user name !");
    }

    sqlQuery = `select * from User_groups where uid=${result[0].id} AND gid=${gid} `;
    promise = new Promise((resolve, reject) => {
      dbconnection.query(sqlQuery, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const result2 = await promise;

    if (result2.length > 0) {
      throw Error("User is already the member of this group !");
    }

    sqlQuery = `insert into User_groups(uid,gid)values (${result[0].id},${gid});`;
    promise = new Promise((resolve, reject) => {
      dbconnection.query(sqlQuery, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const result3 = await promise;
    // console.log(result3);

    res.status(200).json({
      success: true,
      newmember: result[0],
    });
  } catch (err) {
    console.log("ERROR FROM ADD MEMBER :: ", err.message);
    console.log(err);

    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

exports.addexpense = async (req, res, next) => {
  try {
    const gid = req.params.gid;
    const user = req.user.id;
    const { amount, description, category, member_include } = req.body;

    const member_include_string = JSON.stringify(member_include);
    const splitamount = amount / member_include.length;

    let sqlQuery =
      "insert into Bills(category, disc, paidby, otherid, amn, paidgid) values ?";
    let entries = [
      [category, description, user, member_include_string, amount, gid],
    ];
    let promise = new Promise((resolve, reject) => {
      dbconnection.query(sqlQuery, [entries], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const result = await promise;
    const bill_id = result.insertId;

    sqlQuery =
      "insert into Ubills(userid, billid, splitamount, groupid, paidto, paid) values ?";
    entries = [];

    member_include.forEach((curr, index) => {
      let inner_array = [];
      if (curr === req.user.id) {
        inner_array = [curr, bill_id, splitamount, gid, user, true];
      } else {
        inner_array = [curr, bill_id, splitamount, gid, user, false];
      }
      entries.push(inner_array);
    });

    promise = new Promise((resolve, reject) => {
      dbconnection.query(sqlQuery, [entries], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const mainresult = await promise;
    // console.log("main", mainresult);

    sqlQuery = `select Users.uname, Users.email, Users.contact, Users.contact, Users.photo1, Bills.id, category, disc, paidby, amn,Bills.Created_at from Bills inner join Users on Bills.paidby=Users.id where Bills.paidgid=${gid} AND Bills.id = ${bill_id}`;

    promise = new Promise((resolve, reject) => {
      dbconnection.query(sqlQuery, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const newBill = await promise;
    console.log(newBill);

    res.status(200).json({
      success: true,
      newBill: newBill[0],
    });
  } catch (err) {
    console.log("ERROR FROM ADD EXPENSE :: ", err.message);
    console.log(err);

    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

exports.getprofiledata = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    console.log("ERROR FROM GET PROFILE DATA :: ", err.message);
    console.log(err);

    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};
