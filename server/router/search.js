const express = require("express");
const router = express.Router();
const {
  searchByTagName, searchByKeyword
} = require("../controllers/search");

router.get("/", (req, res) => {
  if (req.query.tagName) searchByTagName(req, res);
  else if (req.query.keyword) searchByKeyword(req, res);
});

module.exports = router;