const express = require("express");
const {
  signIn,
  signUp,
  forgotPassword,
  resetPassword,
  changeName,
  changePassword,
  signInAdmin
} = require("./auth.controller");
const router = express.Router();



router.post("/login", signIn);
router.post("/loginAdmin", signInAdmin);
router.post("/register", signUp);
router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword/:resetToken", resetPassword);
router.put("/changeName/:id", changeName);
router.put("/changePassword/:id", changePassword);

module.exports = router;
