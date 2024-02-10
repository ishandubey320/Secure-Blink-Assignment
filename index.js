const express = require("express");
const createError = require("http-errors");
require("dotenv").config();
const router = require("./routes/auth.route.js");
const PORT = process.env.PORT || 3000;
const app = express();
const { verifyAccessToken } = require("./helpers/init_jwt.js");
const { isAdmin } = require("./middleware/isAdmin.js");

app.use(express.json());
app.use(express.urlencoded({ extend: true }));

app.get("/", verifyAccessToken, async (req, res, next) => {
  res.send("home Page");
});

app.use("/auth", router);

app.get("/admin-panel", verifyAccessToken, isAdmin, (req, res, next) => {
  try {
    res.send("Admin panel accessed successfully");
  } catch (error) {
    next(error);
  }
});

app.use(async (req, res, next) => {
  next(createError.NotFound("this url does not exist!"));
});

app.use(async (error, req, res, next) => {
  res.status(error.status || 500);
  res.send({
    error: {
      status: error.status || 500,
      message: error.message,
    },
  });
});

app.listen(PORT, () => {
  console.log(`server connected at http://localhost:${PORT}`);
});
