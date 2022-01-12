import axios from "axios";
import { Request, Response } from "express";

export const getPartyList = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "getPartyList" });
}

export const createParty = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "createParty" });
}
