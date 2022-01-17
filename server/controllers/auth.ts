import axios from "axios";
import { Request, Response } from "express";
import { InternalServerError, SuccessfulResponse, FailedResponse } from "./functions/response";
import { generateAccessToken, verifyAccessToken, setCookie, clearCookie } from "./functions/token";
import { findUser, createUser } from "./functions/sequelize";
import qs from "qs";
import google from "../config"
import { Users } from "../models/users";

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userInfo = await findUser({ email, password }, [ "id", "profileImage", "userName", "region", "signupType" ]);
    if (!userInfo) return FailedResponse(res, 401, "Unauthorized User");
    return SuccessfulResponse(res, { message: "You Have Successfully Signed In", userInfo });
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};

export const signout = async (req: Request, res: Response) => {
  try {
    const { accessToken, signupType } = req.body;
    if (signupType === "gereral") {
      
    }
    else if (signupType === "kakao") {
      const response = await axios({
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
    return SuccessfulResponse(res, { message: "You Have Successfully Signed Out" });
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { userInfo } = req.body;
    const result = await createUser({ ...userInfo, signupType: "general" });
    if (result) return SuccessfulResponse(res, { message: "Welcome!" });
    return FailedResponse(res, 409, "Already Signed Up");
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};

export const guest = async (req: Request, res: Response) => {
  return SuccessfulResponse(res, { message: "3" });
};

export const googleSignIn = async (req: Request, res: Response) => {
  try {
    let code = req.body.authorizationCode 
    if ( code[1] === "/" ) {
      code = code.replace("/", "%2F") 
    }
    console.log(code[1])
    const { authorizationCode } = req.body;
    const { googleClientId, googleClientSecret } = google.google;
    const params = {
      code: authorizationCode,
      client_id: googleClientId,
      client_secret: googleClientSecret,
      redirect_uri: process.env.REACT_APP_REDIRECT_URI,
      grant_type: "authorization_code",
    };

    const axiosResponse = await axios({
      method: "post",
      url: "https://oauth2.googleapis.com/token",
      params,
    });

    const { access_token: accessToken } = axiosResponse.data;
    const profileResponse = await axios({
      method: "get",
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(profileResponse)
    const { name, email, picture } = profileResponse.data;
    const checkUser = await findUser({ email });
    if (!checkUser) {
      await createUser({
        userName: name,
        profileImage: picture,
        email,
        gender: "unidentified",
        birth: new Date("11/11/2222"),
        region: "unidentified",
        mobile: "unidentified",
        exp: 25,
        level: 1,
        signupType: "google"
      });
    }
    const userInfo = await findUser({ email }, [ "id", "userName", "profileImage", "region" ]);
    return SuccessfulResponse(res, { message: "You have successfully signed in with Google Account", userInfo: { ...userInfo, accessToken} });
  } catch (error) {
    InternalServerError(res, error);
  }
};

export const kakao = async (req: Request, res: Response) => {
  try {
    const { authorizationCode } = req.body;
    const response = await axios({
      method: "POST",
      url: "https://kauth.kakao.com/oauth/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      params : {
        grant_type: "authorization_code",
        client_id: "dfdae48bc5a2f6e1f3326d50455762b3",
        client_secret: "eHYGMf3Vm2V5IbA0frZ1qfvdsgJwgZcv",
        redirect_uri: "http://localhost:3000",
        code: authorizationCode
      }
    });

    const accessToken = response.data.access_token;
    const userInfoFromKakao = await axios({
      method: "GET",
      url: "https://kapi.kakao.com/v2/user/me",
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });

    const { nickname, profile_image } = userInfoFromKakao.data.properties;
    const { email, gender } = userInfoFromKakao.data.kakao_account;
    const checkUser = await findUser({ email });
    if (!checkUser) {
      await createUser({
        userName: nickname,
        profileImage: profile_image,
        email,
        gender: gender === "male" ? "M" : "F",
        birth: new Date("11/11/2222"),
        region: "KAKAO",
        mobile: "KAKAO",
        exp: 25,
        level: 1,
        signupType: "kakao"
      });
    }
<<<<<<< HEAD
    const userInfo = await findUser({ email }, [ "id", "userName", "profileImage", "region" ]);
    return SuccessfulResponse(res, { message: "You have successfully signed in with Kakao Account", userInfo: { ...userInfo, accessToken} });
=======
    const userInfo = await findUser({ email }, [ "id", "userName", "profileImage", "region", "signupType" ]);
    return SuccessfulResponse(res, { message: "You have successfully signed in", userInfo: { ...userInfo, accessToken} });
>>>>>>> d7f25c652d9e07137df907f61d5b0909b2852a33
  }
  catch (error) {
    InternalServerError(res, error);
  }
};

export const keepLoggedIn = async (req: Request, res: Response) => {
  try {
    const { accessToken, signupType } = req.body;
    if (signupType === "general") {

    }
    else if (signupType === "kakao") {
      const userInfoFromKakao = await axios({
        method: "GET",
        url: "https://kapi.kakao.com/v2/user/me",
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      const { email } = userInfoFromKakao.data.kakao_account;
      const userInfo = await findUser({ email }, [ "id", "userName", "profileImage", "region", "signupType" ]);
      SuccessfulResponse(res, { message: "Keep Logged in", userInfo });
    }
    else if (signupType === "google") {

    }
    else if (signupType === "guest") {

    }
  }
  catch (error) {
    InternalServerError(res, error);
  }
};