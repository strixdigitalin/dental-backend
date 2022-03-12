const express = require("express");
const {
  uploadProfile,
  addQuestions,
  getProfile,
  GetAllUsers,
} = require("./profile.controller");
const router = express.Router();
const { verifyToken, AdminVerifyToken } = require("../../middlewares/auth");

router.post("/", verifyToken, uploadProfile);
router.get("/:id", getProfile);
router.get("/all/user", GetAllUsers);

module.exports = router;
