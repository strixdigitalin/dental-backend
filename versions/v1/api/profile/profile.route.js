const express = require("express");
const {
  uploadProfile,
  addQuestions,
  getProfile,
  GetAllUsers
} = require("./profile.controller");
const router = express.Router();
const { verifyToken, AdminVerifyToken } = require("../../middlewares/auth");

router.post("/", verifyToken ,uploadProfile);
router.get("/",verifyToken, getProfile);
router.get("/all",AdminVerifyToken,GetAllUsers);

module.exports = router;
