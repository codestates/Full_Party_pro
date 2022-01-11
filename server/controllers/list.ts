import { Request, Response } from "express";
import { internalServerError } from "./functions/utility";
import { generateAccessToken, verifyAccessToken, setCookie, clearCookie } from "./functions/token";
import { findUser, getLeadingParty, getParticipatingParty, getLocalParty, checkIsRead, createNewParty } from "./functions/sequelize";

export const getPartyList = async (req: Request, res: Response) => {
  try {
    const { userId, region, location } = req.params;
    const userInfo = await findUser({ id: userId }, [ "id", "userName", "profileImage" ]);
    const leadingParty = await getLeadingParty(Number(userId));
    const participatingParty = await getParticipatingParty(Number(userId));
    const localParty = await getLocalParty(Number(userId), region);
    const notification = await checkIsRead(Number(userId));
    return res.status(200).json({ 
      message: "Loaded Successfully",
      userInfo,
      myParty: [ ...leadingParty, ...participatingParty ],
      localParty,
      notification
    });
  }
  catch (error) {
    internalServerError(res, error);
  }
}

export const createParty = async (req: Request, res: Response) => {
  try {
    const { userId, partyInfo } = req.body;
    const newParty = await createNewParty(Number(userId), partyInfo);
    return res.status(200).json({ message: "Successfully Created", newParty });
  }
  catch (error) {
    internalServerError(res, error);
  }
}
