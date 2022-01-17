import express from "express";
const router = express.Router();

import {
   signin, signout, signup, guest, google, kakao, keepLoggedIn
} from "../controllers/auth";

router.post("/signin", signin);
router.post("/signout", signout);
router.post("/signup", signup);
router.post("/guest", guest);
router.post("/google", google);
router.post("/kakao", kakao);
router.post("/keeping", keepLoggedIn);

export = router;