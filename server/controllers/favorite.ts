import { Request, Response } from "express";
import { internalServerError } from "./functions/utility";
import { generateAccessToken, verifyAccessToken, setCookie, clearCookie } from "./functions/token";
import { createNotification, findUser, getPartyInformation, invertFavorite } from './functions/sequelize';
import { NotificationAttributes } from "../models/notification";

export const handleFavorite = async (req: Request, res: Response) => {
  try {
    const { userId, partyId } = req.body;
    const result = await invertFavorite(userId, partyId);
    const party = await getPartyInformation(partyId);
    const user = await findUser({ id: userId }, [ "userName" ]);
    if (result) {
      const notificationInfo: NotificationAttributes = {
        content: "favorite", 
        userId: Number(party.leaderId), 
        partyId, 
        userName: user?.userName, 
        partyName: party.name,
        isRead: false
      };
      await createNotification(notificationInfo);
      return res.status(200).json({ message: "Like selected" });
    }
    else return res.status(200).json({ message: "Like canceled" });
  }
  catch (error) {
    internalServerError(res, error);
  }
}