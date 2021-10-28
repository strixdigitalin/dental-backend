const express = require("express");
const {
  signIn,
  signUp,
  forgotPassword,
  resetPassword,
  changeName,
  changePassword
} = require("./adminAuth.controller");
const router = express.Router();



router.post("/login", signIn);
router.post("/register", signUp);
router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword/:resetToken", resetPassword);
router.put("/changeName/:id", changeName);
router.put("/changePassword/:id", changePassword);

module.exports = router;