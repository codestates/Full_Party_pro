import { UsersAttributes } from './../models/users';
import { Request, Response } from "express";
import { InternalServerError, SuccessfulResponse, FailedResponse } from "./functions/response";
import { deleteUser, findCompletedParty, findLeadingParty, findParticipatingParty, findUser, getNotification, updateUser } from "./functions/sequelize";
import { generateAccessToken, verifyAccessToken, setCookie, clearCookie } from "./functions/token";

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userInfo = await findUser({ id: userId }, [ "id", "userName", "profileImage", "region", "exp", "level" ]);
    const notifications = await getNotification(Number(userId));
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
    const { userId } = req.params;
    const deleted = await deleteUser(Number(userId));
    if (deleted) return SuccessfulResponse(res, { message: "Good Bye!" });
    return FailedResponse(res, 400, "Bad Request");
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};

// 메세지가 빠져있음 아래 세 개
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
    const userInfo = { userName, password, birth, gender, region, mobile, profileImage } as UsersAttributes;
    const updated = await updateUser(userId, userInfo);
    if (updated) return SuccessfulResponse(res, { message: "Successfully Modified" });
    return FailedResponse(res, 400, "Bad Request");
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};