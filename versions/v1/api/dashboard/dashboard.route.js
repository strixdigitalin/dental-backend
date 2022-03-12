const express = require("express");
const { getUsedInfo } = require("./dashboard.controller");
const router = express.Router();
const { verifyToken, AdminVerifyToken } = require("../../middlewares/auth");

router.get("/getusedinfo/:id", getUsedInfo);
module.exports = router;
