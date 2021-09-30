const express = require("express");
const { verifyToken } = require("../../middlewares/auth");
const {
  getAllCategory,
  getCategory,
  createCategory,
  getCatValues,
  getAllSubjects,
  createSubject
} = require("./subject.controller");
const router = express.Router();

router.route("/").get(getAllSubjects).post(createSubject);
router.get("/category",verifyToken,getCatValues);

module.exports = router;
