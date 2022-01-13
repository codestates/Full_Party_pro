import { Request, Response } from "express";
import { InternalServerError, SuccessfulResponse } from "./functions/response";
import { generateAccessToken, verifyAccessToken, setCookie, clearCookie } from "./functions/token";
import { getNotification } from "./functions/sequelize";

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const notifications = await getNotification(Number(userId));
    return SuccessfulResponse(res, { message: "Notifications Successfully Loaded", notifications });
  }
  catch (error) {
    return InternalServerError(res, error);
  }
}