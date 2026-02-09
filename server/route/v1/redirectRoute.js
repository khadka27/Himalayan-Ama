const express = require("express");
const router = express.Router();
const redirectController = require("../../controller/redirectController");

router.get("/:code", redirectController.redirectShortLink);

module.exports = router;
