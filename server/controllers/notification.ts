import { Request, Response } from "express";
import { InternalServerError, SuccessfulResponse, FailedResponse } from "./functions/response";
import { getNotification, checkIsRead } from "./functions/sequelize";

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (userId === "0.1") return FailedResponse(res, 400, "Bad Request");
    const notifications = await getNotification(Number(userId));
    const notification = await checkIsRead(Number(userId));
    return SuccessfulResponse(res, { message: "Notifications Successfully Loaded", notifications, notification });
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};