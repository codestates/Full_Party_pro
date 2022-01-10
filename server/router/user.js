const express = require("express");
const router = express.Router();
const {
  getUserInfo, withdrawUser, getRecruitingParty, getParticipatingParty, 
  getCompletedParty, getFavoriteParty, getUserProfile, verifyUser, modifyUserInfo
} = require("../controllers/user");

router.get("/:userId", getUserInfo);
router.delete("/:userId", withdrawUser);
router.get("/recruiting/:userId", getRecruitingParty);
router.get("/participating/:userId", getParticipatingParty);
router.get("/completing/:userId", getCompletedParty);
router.get("/favorite/:userId", getFavoriteParty);
router.get("/profile/:userId", getUserProfile);
router.post("/verification", verifyUser);
router.patch("/profile", modifyUserInfo);

module.exports = router;