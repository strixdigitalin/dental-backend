const express = require("express");
const { verifyToken, AdminVerifyToken } = require("../../middlewares/auth");
const {
  getAllSubjects,
  createSubject,
  getSubjectDetails,
} = require("./subject.controller");
const router = express.Router();

router.route("/").get(AdminVerifyToken,getAllSubjects).post(AdminVerifyToken,createSubject);

router.route("/details").get(verifyToken, getSubjectDetails);

module.exports = router;
