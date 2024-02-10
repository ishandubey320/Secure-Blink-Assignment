const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const { verifyAccessToken } = require("../helpers/init_jwt");

//Register Route
router.post("/register", AuthController.register);

//login Route
router.post("/login", AuthController.login);

//forgot password
router.post("/forgot-password", AuthController.forgotPassword);

//reset-password
router.post(
  "/reset-password/:token",
  verifyAccessToken,
  AuthController.resetPassword
);

module.exports = router;
