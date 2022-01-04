const express = require("express");
const router = express.Router();
const {
  handleFavorite
} = require("../controllers/favorite");

router.post("/:partyId", handleFavorite);

module.exports = router;