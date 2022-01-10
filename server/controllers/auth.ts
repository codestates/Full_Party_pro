import { Request, Response } from "express";
import axios from "axios";

export const signin = async (req: Request, res: Response) => {
  res.status(200).json({ message: "You Have Successfully Signed In" });
}

export const signout = async (req: Request, res: Response) => {
  res.status(200).json({ message: "1" });
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