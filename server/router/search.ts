import express, { Request, Response } from "express";
const router = express.Router();
import { searchByTagNameOrKeyword } from "../controllers/search";

router.get("/", searchByTagNameOrKeyword);

export = router;