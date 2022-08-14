const express = require("express");

const router = express.Router();
const { verifyToken, AdminVerifyToken } = require("../../middlewares/auth");
const { getAllData } = require("./landingController");
router.get("/all", getAllData);

module.exports = router;
