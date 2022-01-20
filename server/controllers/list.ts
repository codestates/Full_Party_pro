import { Request, Response } from "express";
import { InternalServerError, SuccessfulResponse, FailedResponse } from "./functions/response";
import { generateAccessToken, verifyAccessToken, setCookie, clearCookie } from "./functions/token";
import { findUser, getLeadingParty, getParticipatingParty, getLocalParty, checkIsRead, createNewParty } from "./functions/sequelize";

export const getPartyList = async (req: Request, res: Response) => {
  try {
    const { userId, region } = req.params;
    const userInfo = await findUser({ id: Number(userId) }, [ "id", "userName", "profileImage", "address" ]);
    const leadingParty = await getLeadingParty(Number(userId));
    const participatingParty = await getParticipatingParty(Number(userId));
    const localParty = await getLocalParty(Number(userId), region);
    const notification = await checkIsRead(Number(userId));
    let myParty = [ ...leadingParty ];
    participatingParty.map((item: any, i: number) => item.id === myParty[i].id ? item : myParty.push(item));
    return SuccessfulResponse(res, {
      message: "Loaded Successfully",
      userInfo,
      myParty,
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
    console.log("🌈", userId);
    const latlng = JSON.stringify(partyInfo.latlng);
    const newParty = await createNewParty(Number(userId), { ...partyInfo, latlng });
    return SuccessfulResponse(res, { message: "Successfully Created", newParty });
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};
