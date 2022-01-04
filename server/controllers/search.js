const axios = require("axios");

module.exports = {
  searchByTagName: async (req, res) => {
    return res.status(200).json({ message: "searchByTagName" });
  },
  searchByKeyword: async (req, res) => {
    return res.status(200).json({ message: "searchByKeyword" });
  }
}