import { Request, Response } from "express";
import { internalServerError } from "./functions/utility";
import { generateAccessToken, verifyAccessToken, setCookie, clearCookie } from "./functions/token";
import { getPartyInformation, compileComments, createUserParty } from "./functions/sequelize";

export const getPartyInfo = async (req: Request, res: Response) => {
  try {
    const { partyId } = req.params;
    const partyInfo = await getPartyInformation(Number(partyId));
    const comments = await compileComments(Number(partyId));
    return res.status(200).json({ message: "Party Information Loaded", partyInfo, comments });
  }
  catch (error) {
    internalServerError(res, error);
  }
}

export const enqueue = async (req: Request, res: Response) => {
  try {
    const { userId, partyId, message } = req.body;
    const created = await createUserParty(userId, partyId, message);
    if (created) return res.status(200).json({ message: "Enqueue Successfully" });
    return res.status(400).json({ message: "Bad Request" });
  }
  catch (error) {
    internalServerError(res, error);
  }
}

export const dequeue = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ message: "dequeue" });
  }
  catch (error) {
    internalServerError(res, error);
  }
}

export const dismissParty = async (req: Request, res: Response) => {
  try {
    const { partyId } = req.params;
    // await deleteParty(Number(partyId));
    return res.status(200).json({ message: "Successfully Broke Up" });
  }
  catch (error) {
    internalServerError(res, error);
  }
}

export const createSubcomment = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ message: "createSubcomment" });
  }
  catch (error) {
    internalServerError(res, error);
  }
}

export const createComment = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ message: "createComment" });
  }
  catch (error) {
    internalServerError(res, error);
  }
}

export const deleteComment = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ message: "deleteComment" });
  }
  catch (error) {
    internalServerError(res, error);
  }
}

export const deleteSubcomment = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ message: "deleteSubcomment" });
  }
  catch (error) {
    internalServerError(res, error);
  }
}

export const modifyMessage = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ message: "modifyMessage" });
  }
  catch (error) {
    internalServerError(res, error);
  }
}

export const approveMember = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ message: "approveMember" });
  }
  catch (error) {
    internalServerError(res, error);
  }
}

export const quitParty = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ message: "quitParty" });
  }
  catch (error) {
    internalServerError(res, error);
  }
}

export const fullParty = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ message: "fullParty" });
  }
  catch (error) {
    internalServerError(res, error);
  }
}

export const completeParty = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ message: "completeParty" });
  }
  catch (error) {
    internalServerError(res, error);
  }
}

export const reviewMembers = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ message: "reviewMembers" });
  }
  catch (error) {
    internalServerError(res, error);
  }
}