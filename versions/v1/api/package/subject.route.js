const express = require("express");
const { verifyToken, AdminVerifyToken } = require("../../middlewares/auth");
const {
  getAllSubjects,
  createSubject,
  getSubjectDetails,
  getSubjectsWithTitle,
  update,
  deletePackage,
} = require("./subject.controller");
const router = express.Router();

router
  .route("/")
  // .get(AdminVerifyToken, getAllSubjects)
  .get(getAllSubjects)
  .post(createSubject); // this is to create package

// .post(AdminVerifyToken, createSubject);  // this is to create package

router.route("/details").get(verifyToken, getSubjectDetails);

router.patch("/update/:id", update);
router.delete("/:id", deletePackage);

module.exports = router;
