import { UsersAttributes } from './../models/users';
import { Request, Response } from "express";
import axios from 'axios';
import { InternalServerError, SuccessfulResponse, FailedResponse } from "./functions/response";
import { deleteUser, findCompletedParty, findLeadingParty, findParticipatingParty, findUser, getNotification, updateUser } from "./functions/sequelize";
import { generateAccessToken, verifyAccessToken, setCookie, clearCookie } from "./functions/token";

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const { userId, signupType } = req.params;
    const accessToken = req.headers.authorization?.slice(6);
    const notifications = await getNotification(Number(userId));
    if (signupType === "gereral") {
      
    }
    else if (signupType === "kakao") {
      try {
        const userInfoFromKakao = await axios({
          method: "GET",
          url: "https://kapi.kakao.com/v2/user/me",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          }
        });
        const { email } = userInfoFromKakao.data.kakao_account;
        const userInfo = await findUser({ email }, [ "id", "userName", "profileImage", "region", "exp", "level", "signupType" ]);
        if (userInfo && notifications) return SuccessfulResponse(res, {
          message: "Loaded Successfully",
          userInfo,
          notifications
        });
      }
      catch (error) {
        // console.log(error);
      }
    }
    else if (signupType === "google") {
      
    }
    else if (signupType === "guest") {

    }
    return FailedResponse(res, 400, "Bad Request");
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};

export const withdrawUser = async (req: Request, res: Response) => {
  try {
    const { userId, signupType } = req.params;
    const accessToken = req.headers.authorization;
    const deleted = await deleteUser(Number(userId));
    if (signupType === "gereral") {
      
    }
    else if (signupType === "kakao") {
      await axios({
        method: "POST",
        url: "https://kapi.kakao.com/v1/user/logout",
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
    }
    else if (signupType === "google") {
      
    }
    else if (signupType === "guest") {

    }
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
    const updatedUserInfo = await findUser({ id: userId }, [ "userName", "password", "birth", "gender", "region", "mobile", "profileImage" ]);
    if (updated) return SuccessfulResponse(res, { message: "Successfully Modified", userInfo: updatedUserInfo });
    return FailedResponse(res, 400, "Bad Request");
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};