import express from "express";
const router = express.Router();

import {
   signin, signout, signup, guest, google, kakao
} from "../controllers/auth";

router.post("/signin", signin);
router.post("/signout", signout);
router.post("/signup", signup);
router.post("/guest", guest);
router.post("/google", google);
router.post("/kakao", kakao);

export = router;