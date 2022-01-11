import { Request, Response } from "express";
import { internalServerError } from "./functions/utility";
import { generateAccessToken, verifyAccessToken, setCookie, clearCookie } from "./functions/token";

export const searchByTagName = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "searchByTagName" });
}

export const searchByKeyword = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "searchByKeyword" });
}