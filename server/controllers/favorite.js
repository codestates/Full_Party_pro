const axios = require("axios");

module.exports = {
  handleFavorite: async (req, res) => {
    return res.status(200).json({ message: "favorite" });
  }
}