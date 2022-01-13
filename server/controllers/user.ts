import { UsersAttributes } from './../models/users';
import { Request, Response } from "express";
import { InternalServerError, SuccessfulResponse, FailedResponse } from "./functions/response";
import { deleteUser, findUser, getNotification, updateUser } from "./functions/sequelize";
import { generateAccessToken, verifyAccessToken, setCookie, clearCookie } from "./functions/token";

// API: 레벨 추가 필요
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
}

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
}

export const getRecruitingParty = async (req: Request, res: Response) => {
  try {
    return SuccessfulResponse(res, { message: "" });
  }
  catch (error) {
    return InternalServerError(res, error);
  }
}

export const getParticipatingParty = async (req: Request, res: Response) => {
  try {
    return SuccessfulResponse(res, { message: "" });
  }
  catch (error) {
    return InternalServerError(res, error);
  }
}

export const getCompletedParty = async (req: Request, res: Response) => {
  try {
    return SuccessfulResponse(res, { message: "" });
  }
  catch (error) {
    return InternalServerError(res, error);
  }
}

export const getFavoriteParty = async (req: Request, res: Response) => {
  try {
    return SuccessfulResponse(res, { message: "" });
  }
  catch (error) {
    return InternalServerError(res, error);
  }
}

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
}

// API: 바디에 id를 userId로
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
}

// name ~ mobile
// API: id -> userId
// API: email 빼고, userName, birth, gender, region, mobile
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
}