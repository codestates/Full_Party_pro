const express = require("express");
const router = express.Router();
const {
  getPartyList, createParty
} = require("../controllers/list");

router.get("/:userId", getPartyList);
router.post("/creation", createParty);

module.exports = router;