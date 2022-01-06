const axios = require("axios");

module.exports = {
  getUserInfo: async (req, res) => {
    return res.status(200).json({ message: "getUserInfo" });
  },
  withdrawUser: async (req, res) => {
    return res.status(200).json({ message: "withdrawUser" });
  },
  getRecruitingParty: async (req, res) => {
    return res.status(200).json({ message: "getRecruitingParty" });
  },
  getParticipatingParty: async (req, res) => {
    return res.status(200).json({ message: "getParticipatingParty" });
  },
  getCompletedParty: async (req, res) => {
    return res.status(200).json({ message: "getCompletedParty" });
  },
  getFavoriteParty: async (req, res) => {
    return res.status(200).json({ message: "getFavoriteParty" });
  },
  getUserProfile: async (req, res) => {
    return res.status(200).json({ message: "getUserProfile" });
  },
  verifyUser: async (req, res) => {
    return res.status(200).json({ message: "verifyUser" });
  },
  modifyUserInfo: async (req, res) => {
    return res.status(200).json({ message: "modifyUserInfo" });
  }
}