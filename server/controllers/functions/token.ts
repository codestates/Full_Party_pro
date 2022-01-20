import { Response } from "express";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import config from "../../config/index"

export const generateAccessToken = (data: any) => {
  try {
    return sign(data, config.accessSecret, { expiresIn: "15m" });
  }
  catch (error) {
    console.log(error);
  }
};

export const verifyAccessToken = (token: string): JwtPayload | string | undefined  => {
  try {
    return verify(token, config.accessSecret);
  }
  catch (error) {
    return error;
  }
};

export const setCookie = (res: Response, type: string, token: string | null) => {
  try {
    res.cookie(type, token, {
      domain: "localhost",
      path: "/",
      sameSite: "none",
      secure: true,
      httpOnly: false,
      maxAge: 1000 * 60 * 60 * 24,
    });
  }
  catch (error) {
    console.log(error);
  }
};

export const clearCookie = (res: Response, type: string) => {
  try {
    res.clearCookie(type, {
      secure: true,
      sameSite: "none",
      httpOnly: true
    });
  }
  catch (error) {
    console.log(error);
  }
};