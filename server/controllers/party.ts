import axios from "axios";
import { Request, Response } from "express";

export const getPartyInfo = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "getPartyInfo" });
}

export const deleteParty = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "deleteParty" });
}

export const createSubcomment = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "createSubcomment" });
}

export const createComment = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "createComment" });
}

export const deleteComment = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "deleteComment" });
}

export const deleteSubcomment = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "deleteSubcomment" });
}

export const enqueue = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "enqueue" });
}

export const dequeue = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "dequeue" });
}

export const modifyMessage = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "modifyMessage" });
}

export const approveMember = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "approveMember" });
}

export const quitParty = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "quitParty" });
}

export const fullParty = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "fullParty" });
}

export const completeParty = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "completeParty" });
}

export const reviewMembers = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "reviewMembers" });
}