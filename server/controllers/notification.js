const axios = require("axios");

module.exports = {
  getNotifications: async (req, res) => {
    return res.status(200).json({ message: "getNotifications" });
  }
}