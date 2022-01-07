const axios = require("axios");

module.exports = {
  signin: async (req, res) => {
    res.status(200).json({ message: "You Have Successfully Signed In" });
  },
  signout: async (req, res) => {
    res.status(200).json({ message: "1" });
  },
  signup: async (req, res) => {
    res.status(200).json({ message: "2" });
  },
  guest: async (req, res) => {
    res.status(200).json({ message: "3" });
  },
  google: async (req, res) => {
    res.status(200).json({ message: "4" });
  },
  kakao: async (req, res) => {
    res.status(200).json({ message: "5" });
  },
}