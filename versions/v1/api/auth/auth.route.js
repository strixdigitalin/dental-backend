const express = require("express");
const {
  signIn,
  signUp,
  forgotPassword,
  resetPassword,
  changeName,
  changePassword,
  logout
} = require("./auth.controller");
const router = express.Router();



router.post("/login", signIn);
router.post("/register", signUp);
router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword/:resetToken", resetPassword);
router.patch("/changeName/:id", changeName);
router.patch("/changePassword/:id", changePassword);
router.post("/logout", logout);

module.exports = router;
