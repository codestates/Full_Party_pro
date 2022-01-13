import express, { Request, Response } from "express";
const router = express.Router();
import { searchByTagName, searchByKeyword } from "../controllers/search";

router.get("/", (req: Request, res: Response) => {
  if (req.query.tagName) searchByTagName(req, res);
  else if (req.query.keyword) searchByKeyword(req, res);
});

export = router;