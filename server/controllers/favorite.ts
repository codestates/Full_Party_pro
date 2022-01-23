import { Request, Response } from "express";
import { InternalServerError, SuccessfulResponse, FailedResponse } from "./functions/response";
import { createNotification, findUser, getPartyInformation, invertFavorite, findFavoriteParties, checkIsRead } from './functions/sequelize';
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
      return SuccessfulResponse(res, { message: "Like Selected" });
    }
    else return SuccessfulResponse(res, { message: "Like Canceled" });
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};

export const getFavoriteParty = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const partyList = await findFavoriteParties(Number(userId));
    const notification = await checkIsRead(Number(userId));
    return SuccessfulResponse(res, { message: "Successfully Loaded", partyList, notification });
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};
