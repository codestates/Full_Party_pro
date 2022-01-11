import express from "express";
const router = express.Router();
import { getNotifications } from "../controllers/notification";

router.get("/:userId", getNotifications);

export = router;