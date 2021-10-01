const express = require("express");
const { verifyToken } = require("../../middlewares/auth");
const {
  getAllSubjects,
  createSubject
} = require("./subject.controller");
const router = express.Router();

router.route("/").get(getAllSubjects).post(createSubject);

module.exports = router;
