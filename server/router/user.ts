import express from "express";
const router = express.Router();
import { getUserInfo, withdrawUser, getRecruitingParty, getParticipatingParty, getCompletedParty, getUserProfile, verifyUser, modifyUserInfo } from "../controllers/user";

router.get("/:userId/:signupType", getUserInfo);
router.delete("/:userId/:signupType", withdrawUser);
router.get("/recruiting/:userId", getRecruitingParty);
router.get("/participating/:userId", getParticipatingParty);
router.get("/completing/:userId", getCompletedParty);
router.get("/profile/:userId", getUserProfile);
router.post("/verification", verifyUser);
router.patch("/profile", modifyUserInfo);

export = router;