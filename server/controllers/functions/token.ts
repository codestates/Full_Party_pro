import { Response } from "express";
import { sign, verify } from "jsonwebtoken";
import config from "../../config/index"

export const generateAccessToken = (data: any) => {
  try {
    return sign(data, config.accessSecret, { expiresIn: "15m" });
  }
  catch (error) {
    console.log(error);
    return null;
  }
};

export const verifyAccessToken = (token: string) => {
  try {
    return verify(token, config.accessSecret);
  }
  catch (error) {
    return null;
  }
};

export const setCookie = (res: Response, type: string, token: string | null) => {
  res.cookie(type, token, {
    secure: true,
    sameSite: "none",
    httpOnly: true
  });
};

export const clearCookie = (res: Response, type: string) => {
  res.clearCookie(type, {
    secure: true,
    sameSite: "none",
    httpOnly: true
  });
};