import express from "express";
const router = express.Router();
import { handleFavorite, getFavoriteParty } from "../controllers/favorite";

router.post("/:partyId", handleFavorite);
router.get("/:userId", getFavoriteParty);

export = router;