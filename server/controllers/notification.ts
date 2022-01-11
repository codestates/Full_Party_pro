import { Request, Response } from "express";
import { internalServerError } from "./functions/utility";
import { generateAccessToken, verifyAccessToken, setCookie, clearCookie } from "./functions/token";
import { getNotification } from "./functions/sequelize";

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const notifications = await getNotification(Number(userId));
    return res.status(200).json({ message: "Notifications Successfully Loaded", notifications });
  }
  catch (error) {
    internalServerError(res, error);
  }
}