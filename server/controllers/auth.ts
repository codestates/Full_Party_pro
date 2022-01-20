import { UsersAttributes } from './../models/users';
import axios from "axios";
import { Request, Response } from "express";
import { InternalServerError, SuccessfulResponse, FailedResponse } from "./functions/response";
import { generateAccessToken, verifyAccessToken, setCookie, clearCookie } from "./functions/token";
import { findUser, createUser, deleteUser } from "./functions/sequelize";
import { JwtPayload } from "jsonwebtoken";
import qs from "qs";
import config from "../config"
import { Users } from "../models/users";

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userInfo = await findUser({ email, password }, [ "id", "profileImage", "userName", "address", "signupType" ]);
    if (!userInfo) return FailedResponse(res, 401, "Unauthorized User");
    const accessToken = generateAccessToken(userInfo);
    setCookie(res, "token", String(accessToken));
    return SuccessfulResponse(res, { message: "You Have Successfully Signed In", userInfo });
  }
  catch (error) { 
    return InternalServerError(res, error);
  }
};

export const signout = async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.access_token;
    const signupType = req.headers.signup_type;
    if (signupType === "kakao") {
      await axios({
        method: "POST",
        url: "https://kapi.kakao.com/v1/user/logout",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
      });
    }
    else if (signupType === "guest") {
      const verification =  verifyAccessToken(String(accessToken));
      if (verification && typeof verification !== "string") await deleteUser(verification.id);
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
  try {
    const userInfo: UsersAttributes = {
      userName: "Guest",
      profileImage: "",
      birth: new Date(),
      gender: "Guest",
      mobile: "Guest",
      email: `Guest${Math.floor(Math.random()*1000)}@fullparty.com`,
      address: "Guest",
      exp: 25,
      level: 1,
      signupType: "guest"
    };
    const created = await createUser(userInfo);
    const guestUserInfo = await findUser({ signupType: "guest" }, [ "id", "userName", "email", "birth", "createdAt", "updatedAt" ]);
    const accessToken = generateAccessToken(guestUserInfo);
    if (!created) FailedResponse(res, 400, "Bad Request");
    setCookie(res, "token", String(accessToken));
    return SuccessfulResponse(res, { message: "You Have Successfully Signed In", userInfo: { ...userInfo, ...guestUserInfo }});
  }
  catch (error) {
    InternalServerError(res, error);
  }
};

export const googleSignIn = async (req: Request, res: Response) => {
  try {
    let newAuthorization = ""
    if ( req.body.authorizationCode[1] === "/" ) {
      newAuthorization = req.body.authorizationCode.replace("/", "%2F") 
    }
    const { authorizationCode } = req.body;
    const { googleClientId, googleClientSecret } = config.google;
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
    
    const { name, email, picture } = profileResponse.data;
    const checkUser = await findUser({ email });
    if (!checkUser) {
      await createUser({
        userName: name,
        profileImage: picture,
        email,
        gender: "기타",
        birth: new Date(),
        address: "unidentified",
        mobile: "unidentified",
        exp: 25,
        level: 1,
        signupType: "google"
      });
    }
    const userInfo = await findUser({ email }, [ "id", "userName", "profileImage", "address", "signupType" ]);
    setCookie(res, "token", String(accessToken));
    return SuccessfulResponse(res, { message: "You have successfully signed in with Google Account", userInfo });
  } catch (error) {
    InternalServerError(res, error);
  }
};

export const kakao = async (req: Request, res: Response) => {
  try {
    const { authorizationCode } = req.body;
    try {
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
          redirect_uri: process.env.REACT_APP_REDIRECT_URI,
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
          profileImage: profile_image ? profile_image : null,
          email,
          gender: "기타",
          birth: new Date(),
          address: "KAKAO",
          mobile: "KAKAO",
          exp: 25,
          level: 1,
          signupType: "kakao"
        });
      }
      const userInfo = await findUser({ email }, [ "id", "userName", "profileImage", "address", "signupType" ]);
      setCookie(res, "token", String(accessToken));
      SuccessfulResponse(res, { message: "You have successfully signed in", userInfo });
    }
    catch (error) {
      console.log(error)
    }
  }
  catch (error) {
    InternalServerError(res, error);
  }
};

export const keepLoggedIn = async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.access_token;
    const signupType = req.headers.signup_type;
    if (signupType === "general") {
      const verification = verifyAccessToken(String(accessToken));
      if (!verification) FailedResponse(res, 403, "Invalid access token");
      else if (typeof verification !== "string") {
        const userInfo = await findUser({ id: verification.id }, [ "id", "profileImage", "userName", "address", "signupType" ]);
        SuccessfulResponse(res, { message: "Keep Logged In", userInfo });
      }
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
      const userInfo = await findUser({ email }, [ "id", "userName", "profileImage", "address", "signupType" ]);
      SuccessfulResponse(res, { message: "Keep Logged In", userInfo });
    }
    else if (signupType === "google") {
      const userInfoFromGoogle = await axios({
        method: "GET",
        url: "https://www.googleapis.com/oauth2/v2/userinfo",
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      const { email } = userInfoFromGoogle.data;
      const userInfo = await findUser({ email }, [ "id", "userName", "profileImage", "address", "signupType" ]);
      SuccessfulResponse(res, { message: "Keep Logged In", userInfo });
    }
    else if (signupType === "guest") {
      const verification = verifyAccessToken(String(accessToken));
      if (!verification) FailedResponse(res, 403, "Invalid access token");
      else if (typeof verification !== "string") {
        const userInfo = await findUser({ email: verification.email }, [ "id", "userName", "profileImage", "address", "signupType" ]);
        SuccessfulResponse(res, { message: "Keep Logged In", userInfo });
      }
    }
  }
  catch (error) {
    InternalServerError(res, error);
  }
};