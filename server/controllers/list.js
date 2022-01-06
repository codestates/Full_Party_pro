const axios = require("axios");

module.exports = {
  getPartyList: async (req, res) => {
    return res.status(200).json({ message: "getPartyList" });
  },
  createParty: async (req, res) => {
    return res.status(200).json({ message: "createParty" });
  },
}