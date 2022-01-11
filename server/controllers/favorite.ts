import axios from "axios";
import { Request, Response } from "express";

export const  handleFavorite = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "favorite" });
}