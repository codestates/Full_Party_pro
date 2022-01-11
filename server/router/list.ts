import express from "express";
const router = express.Router();
import { getPartyList, createParty } from "../controllers/list";

router.get("/:userId/:region/:location", getPartyList);
router.post("/creation", createParty);

export = router;