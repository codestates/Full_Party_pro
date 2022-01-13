import axios from "axios";
import { Request, Response } from "express";

export const getUserInfo = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "getUserInfo" });
}

export const withdrawUser = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "withdrawUser" });
}

export const getRecruitingParty = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "getRecruitingParty" });
}

export const getParticipatingParty = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "getParticipatingParty" });
}

export const getCompletedParty = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "getCompletedParty" });
}

export const getFavoriteParty = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "getFavoriteParty" });
}

export const getUserProfile = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "getUserProfile" });
}

export const verifyUser = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "verifyUser" });
}

export const modifyUserInfo = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "modifyUserInfo" });
}