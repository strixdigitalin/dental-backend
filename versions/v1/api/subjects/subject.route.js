const express = require("express");
const { verifyToken } = require("../../middlewares/auth");
const {
  getAllSubjects,
  createSubject,
  getSubjectDetails,
} = require("./subject.controller");
const router = express.Router();

router.route("/").get(getAllSubjects).post(createSubject);

router.route("/details").get(getSubjectDetails);

module.exports = router;
