const express = require("express");
const router = express.Router();
const {
  getNotifications
} = require("../controllers/notification");

router.get("/:userId", getNotifications);

module.exports = router;