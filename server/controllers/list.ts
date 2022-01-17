import { Request, Response } from "express";
import { InternalServerError, SuccessfulResponse, FailedResponse } from "./functions/response";
import { generateAccessToken, verifyAccessToken, setCookie, clearCookie } from "./functions/token";
import { findUser, getLeadingParty, getParticipatingParty, getLocalParty, checkIsRead, createNewParty } from "./functions/sequelize";

export const getPartyList = async (req: Request, res: Response) => {
  try {
    const { userId, region } = req.params;
    const userInfo = await findUser({ id: userId }, [ "id", "userName", "profileImage", "location" ]);
    const leadingParty = await getLeadingParty(Number(userId));
    const participatingParty = await getParticipatingParty(Number(userId));
    const localParty = await getLocalParty(Number(userId), region);
    const notification = await checkIsRead(Number(userId));
    return SuccessfulResponse(res, {
      message: "Loaded Successfully",
      userInfo,
      myParty: [ ...leadingParty, ...participatingParty ],
      localParty,
      notification
    });
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};

export const createParty = async (req: Request, res: Response) => {
  try {
    const { userId, partyInfo } = req.body;
    const newParty = await createNewParty(Number(userId), partyInfo);
    return SuccessfulResponse(res, { message: "Successfully Created", newParty });
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};
