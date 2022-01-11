import { Request, Response } from "express";
import { findUser } from "./functions/sequelize"
import { internalServerError } from "./functions/utility";

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userInfo = await findUser(email, password);
    if (!userInfo) return res.status(401).json({ message: "Unauthorized User" });
    return res.status(200).json({ message: "You Have Successfully Signed In", userInfo });
  }
  catch (error) {
    internalServerError(res, error);
  }
}

export const signout = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "You Have Successfully Signed Out" });
  }
  catch (error) {
    internalServerError(res, error);
  }
}

export const signup = async (req: Request, res: Response) => {
  res.status(200).json({ message: "2" });
}

export const guest = async (req: Request, res: Response) => {
  res.status(200).json({ message: "3" });
}

export const google = async (req: Request, res: Response) => {
  res.status(200).json({ message: "4" });
}

export const kakao = async (req: Request, res: Response) => {
  res.status(200).json({ message: "5" });
}