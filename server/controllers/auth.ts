import { Request, Response } from "express";
import { internalServerError } from "./functions/utility";
import { generateAccessToken, verifyAccessToken, setCookie, clearCookie } from "./functions/token";
import { findUser, createUser } from "./functions/sequelize"

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userInfo = await findUser({ email, password }, [ "id", "profileImage", "userName", "region" ]);
    console.log(userInfo);
    if (!userInfo) return res.status(401).json({ message: "Unauthorized User" });
    return res.status(200).json({ message: "You Have Successfully Signed In", userInfo });
  }
  catch (error) {
    internalServerError(res, error);
  }
};

export const signout = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "You Have Successfully Signed Out" });
  }
  catch (error) {
    internalServerError(res, error);
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { userInfo } = req.body;
    const result = await createUser(userInfo);
    if (result) return res.status(200).json({ message: "Welcome!" });
    return res.status(409).json({ message: "Already Signed Up" });
  }
  catch (error) {
    internalServerError(res, error);
  }
};

export const guest = async (req: Request, res: Response) => {
  res.status(200).json({ message: "3" });
};

export const google = async (req: Request, res: Response) => {
  res.status(200).json({ message: "4" });
};

export const kakao = async (req: Request, res: Response) => {
  res.status(200).json({ message: "5" });
};