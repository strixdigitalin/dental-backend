const express = require("express");
const {
  uploadProfile,
  addQuestions,
  getProfile
} = require("./profile.controller");
const router = express.Router();
const { verifyToken } = require("../../middlewares/auth");

router.post("/", verifyToken ,uploadProfile);
router.get("/",verifyToken, getProfile);
router.patch('/addQuestion',verifyToken,addQuestions);

module.exports = router;
