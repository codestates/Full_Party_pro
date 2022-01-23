import { UsersAttributes } from './../models/users';
import axios from "axios";
import { Request, Response } from "express";
import { InternalServerError, SuccessfulResponse, FailedResponse } from "./functions/response";
import { generateAccessToken, verifyAccessToken, setCookie, clearCookie } from "./functions/token";
import { findUser, createUser, deleteUser } from "./functions/sequelize";
import config from "../config"
import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config();

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
    const { authorizationCode } = req.body;
    let newAuthorization = ""
    if ( authorizationCode[1] === "/" ) {
      newAuthorization = authorizationCode.replace("/", "%2F");
    }
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
        address: "Google",
        mobile: "Google",
        exp: 25,
        level: 1,
        signupType: "google"
      });
    }
    const userInfo = await findUser({ email }, [ "id", "userName", "profileImage", "address", "exp", "level", "signupType" ]);
    setCookie(res, "token", String(accessToken));
    console.log(userInfo)
    return SuccessfulResponse(res, { message: "You Have Successfully Signed In With Google Account", userInfo });
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
          address: "Kakao",
          mobile: "Kakao",
          exp: 25,
          level: 1,
          signupType: "kakao"
        });
      }
      const userInfo = await findUser({ email }, [ "id", "userName", "profileImage", "address", "signupType" ]);
      setCookie(res, "token", String(accessToken));
      SuccessfulResponse(res, { message: "You Have Successfully Signed In With Kakao Account", userInfo });
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

export const mailVerification = async (req: Request, res: Response) => {
  try {
    console.log("🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈");
    const { email } = req.body;
    const code = String(Math.floor(Math.random()*1000000)).padStart(6,"0");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
      }
    });

    const mailOptions = {
      from: 'Full Party! 풀팟 <fullparty.gm@gmail.com>',    
      to: email,                     
      subject: '[풀팟] 이메일 인증을 진행해주세요.',   
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <title>FullParty Verification Email</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body style="margin: 0; padding: 0;">
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center"style="padding: 40px 0 10px 0;">
                <img src="https://teo-img.s3.ap-northeast-2.amazonaws.com/defaultThumbnail.png" alt="fullParty Thumbnial" width="500" height="200" style="display: block;" />
             </td>
            </tr>
            <tr>
              <td align="center">
                풀팟 회원가입을 위한 인증코드입니다.
                <br />아래의 인증 코드를 입력하여 이메일 인증을 완료해주세요.
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 20px 0 20px 0;">
                <font size="5pt" color="#50C9C3"><b>${code}</b></font>
              </td>
            </tr>
          </table>
        </body>
      </html>`,
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      }
      else {
        console.log('Email sent: ' + info.response);
      }
    });
  
    // res.redirect("/");
    return SuccessfulResponse(res, { message: "Authentication Email Sent", code });
  }
  catch (error) {
    return InternalServerError(res, error);
  };
};