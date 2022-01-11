import { Request, Response } from "express";
import { internalServerError } from "./functions/utility";
import { generateAccessToken, verifyAccessToken, setCookie, clearCookie } from "./functions/token";
import { invertFavorite } from './functions/sequelize';

export const  handleFavorite = async (req: Request, res: Response) => {
  try {
    const { userId, partyId } = req.body;
    const result = await invertFavorite(userId, partyId);
    if (result) return res.status(200).json({ message: "Like selected" });
    return res.status(200).json({ message: "Like canceled" });
  }
  catch (error) {
    internalServerError(res, error);
  }
}