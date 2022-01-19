import { UsersAttributes } from './../models/users';
import { Request, Response } from "express";
import axios from 'axios';
import { InternalServerError, SuccessfulResponse, FailedResponse } from "./functions/response";
import { deleteUser, findCompletedParty, findLeadingParty, findParticipatingParty, findUser, getNotification, updateUser } from "./functions/sequelize";
import { generateAccessToken, verifyAccessToken, setCookie, clearCookie } from "./functions/token";

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const notifications = await getNotification(Number(userId));
      const userInfo = await findUser({ id: userId }, [ "id", "userName", "profileImage", "region", "exp", "level", "signupType" ]);
      if (userInfo && notifications) return SuccessfulResponse(res, {
        message: "Loaded Successfully",
        userInfo,
        notifications
      });
    return FailedResponse(res, 400, "Bad Request");
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};

export const withdrawUser = async (req: Request, res: Response) => {
  try {
    const { userId, signupType } = req.params;
    const accessToken = req.headers.access_token;
    const deleted = await deleteUser(Number(userId));
    if (signupType === "kakao") {
      await axios({
        method: "POST",
        url: "https://kapi.kakao.com/v1/user/unlink",
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
    }
    else if (signupType === "guest") {
      const verification =  verifyAccessToken(String(accessToken));
      if (verification && typeof verification !== "string") await deleteUser(verification.id);
    }
    if (deleted) return SuccessfulResponse(res, { message: "Good Bye!" });
    return FailedResponse(res, 400, "Bad Request");
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};

export const getRecruitingParty = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const myParty = await findLeadingParty(Number(userId));
    return SuccessfulResponse(res, { message: "Loaded Successfully", myParty });
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};

export const getParticipatingParty = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const myParty = await findParticipatingParty(Number(userId));
    return SuccessfulResponse(res, { message: "Loaded Successfully", myParty });
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};

export const getCompletedParty = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const myParty = await findCompletedParty(Number(userId));
    return SuccessfulResponse(res, { message: "Loaded Successfully", myParty });
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userInfo = await findUser({ id: userId }, [ "userName", "birth", "email", "region", "mobile", "gender" ]);
    if (userInfo) return SuccessfulResponse(res, { message: "Successfully Loaded", userInfo });
    return FailedResponse(res, 400, "Bad Request");
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const { userId, email, password } = req.body.userInfo;
    const user = await findUser({ email, password });
    if (user?.id === userId) return SuccessfulResponse(res, { message: "User Identified" });
    return FailedResponse(res, 401, "Unauthorized User");
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};

export const modifyUserInfo = async (req: Request, res: Response) => {
  try {
    const { userId, password, userName, birth, gender, region, mobile, profileImage } = req.body.userInfo;
    const userInfo: any = { userName, password, birth, gender, region, mobile, profileImage };
    const updated = await updateUser(userId, userInfo);
    const updatedUserInfo = await findUser({ id: userId }, [ "userName", "password", "birth", "gender", "region", "mobile", "profileImage" ]);
    if (updated) return SuccessfulResponse(res, { message: "Successfully Modified", userInfo: updatedUserInfo });
    return FailedResponse(res, 400, "Bad Request");
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};

export const updateUserAddress = async (req: Request, res: Response) => {
  try {
    const { userId, address } = req.body;
    const updated = await updateUser(userId, { address });
    if (!updated) return FailedResponse(res, 400, "Bad Request");
    SuccessfulResponse(res, { message: "Successfully modified" });
  }
  catch (error) {
    InternalServerError(res, error);
  }
};