const express = require("express");
const {
  uploadProfile,
  getProfile
} = require("./profile.controller");
const router = express.Router();

router.post("/:id", uploadProfile);
router.get("/:id", getProfile);

module.exports = router;
