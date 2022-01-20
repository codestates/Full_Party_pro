import express from "express";
const router = express.Router();
import { mailVerification } from "../controllers/mailVerification";

router.post("/nodemailerTest", mailVerification);

export = router;