const express = require("express");
const router = express.Router();
const GetGoogleController = require("../get/googleGet");

router.get("/", GetGoogleController.getMaps);

module.exports = router;
