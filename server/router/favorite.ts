import express from "express";
const router = express.Router();
import { handleFavorite } from "../controllers/favorite";

router.post("/:partyId", handleFavorite);

export = router;