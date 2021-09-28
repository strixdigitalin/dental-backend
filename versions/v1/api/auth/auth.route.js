const express = require("express");
const {
  signIn,
  signUp,
  forgotPassword,
  resetPassword,
  refreshToken,
} = require("./auth.controller");
const router = express.Router();

// @route - https://dworld-backend.herokuapp.com/api/v1/auth

router.post("/login", signIn);
router.post("/register", signUp);
router.post("/refreshToken", refreshToken);
router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword/:resetToken", resetPassword);

module.exports = router;
