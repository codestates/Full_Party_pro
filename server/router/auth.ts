import express from "express";
const router = express.Router();
import {
   signin, signout, signup, guest, googleSignIn, kakao, keepLoggedIn, mailVerification
} from "../controllers/auth";

router.post("/signin", signin);
router.post("/guest", guest);
router.post("/signout", signout);
router.post("/signup", signup);
router.post("/guest", guest);
router.post("/google", googleSignIn);
router.post("/kakao", kakao);
router.post("/keeping", keepLoggedIn);
router.post("/mailVerification", mailVerification);

export = router;