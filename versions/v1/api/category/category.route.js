const express = require("express");
const { verifyToken } = require("../../middlewares/auth");
const {
  getAllCategory,
  getCategory,
  createCategory,
} = require("./category.controller");
const router = express.Router();

router.route("/").get(getAllCategory).post(createCategory);

module.exports = router;
