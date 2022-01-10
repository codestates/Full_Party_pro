const express = require("express");
const router = express.Router();
const {
   signin, signout, signup, guest, google, kakao
} = require("../controllers/auth");

router.post("/signin", signin);
router.post("/signout", signout);
router.post("/signup", signup);
router.post("/guest", guest);
router.post("/google", google);
router.post("/kakao", kakao);

module.exports = router;