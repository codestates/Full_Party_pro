import express from "express";
const router = express.Router();
import { getPartyList, createParty } from "../controllers/list";

router.get("/:userId", getPartyList);
router.post("/creation", createParty);

export = router;