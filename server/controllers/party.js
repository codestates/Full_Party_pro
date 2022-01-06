const axios = require("axios");

module.exports = {
  getPartyInfo: async (req, res) => {
    return res.status(200).json({ message: "getPartyInfo" });
  },
  deleteParty: async (req, res) => {
    return res.status(200).json({ message: "deleteParty" });
  },
  createSubcomment: async (req, res) => {
    return res.status(200).json({ message: "createSubcomment" });
  },
  createComment: async (req, res) => {
    return res.status(200).json({ message: "createComment" });
  },
  deleteComment: async (req, res) => {
    return res.status(200).json({ message: "deleteComment" });
  },
  deleteSubcomment: async (req, res) => {
    return res.status(200).json({ message: "deleteSubcomment" });
  },
  enqueue: async (req, res) => {
    return res.status(200).json({ message: "enqueue" });
  },
  dequeue: async (req, res) => {
    return res.status(200).json({ message: "dequeue" });
  },
  modifyMessage: async (req, res) => {
    return res.status(200).json({ message: "modifyMessage" });
  },
  approveMember: async (req, res) => {
    return res.status(200).json({ message: "approveMember" });
  },
  quitParty: async (req, res) => {
    return res.status(200).json({ message: "quitParty" });
  },
  fullParty: async (req, res) => {
    return res.status(200).json({ message: "fullParty" });
  },
  completeParty: async (req, res) => {
    return res.status(200).json({ message: "completeParty" });
  },
  reviewMembers: async (req, res) => {
    return res.status(200).json({ message: "reviewMembers" });
  }
}