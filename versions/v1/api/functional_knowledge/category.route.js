const express = require("express");
const { verifyToken } = require("../../middlewares/auth");
const {
  getAllCategory,
  getCategory,
  createCategory,
  getCatValues,
} = require("./category.controller");
const router = express.Router();

router.route("/").get(getAllCategory).post(createCategory);
router.get("/category",verifyToken,getCatValues);

module.exports = router;
