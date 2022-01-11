import axios from "axios";
import { Request, Response } from "express";

export const searchByTagName = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "searchByTagName" });
}

export const searchByKeyword = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "searchByKeyword" });
}