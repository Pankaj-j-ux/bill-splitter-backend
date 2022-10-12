/** @format */

const expresss = require("express");
const morgan = require("morgan");
const cookieP = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const mysql = require("./Config/db_config");
// App ...
const app = expresss();

// Routes ...
const Auth = require("./Routes/AuthRoutes");

// Middlewares ...
app.use(morgan("tiny"));
app.use(expresss.json());
app.use(expresss.urlencoded({ extended: true }));
app.use(cookieP());
app.use(cors());

// Home route ...
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    msg: "You'r Welcome !",
  });
});

// Router Middlewares ...

app.use("/api/v1", Auth);

// Listening to the server ...
app.listen(process.env.PORT, () => {
  console.log(`Server is Listening on PORT $${process.env.PORT}`);
});
