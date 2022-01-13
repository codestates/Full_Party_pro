import { Request, Response } from "express";
import { InternalServerError, SuccessfulResponse, FailedResponse } from "./functions/response";
import { generateAccessToken, verifyAccessToken, setCookie, clearCookie } from "./functions/token";

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    return SuccessfulResponse(res, { message: "" });
  }
  catch (error) {
    return InternalServerError(res, error);
  }
}

export const withdrawUser = async (req: Request, res: Response) => {
  try {
    return SuccessfulResponse(res, { message: "" });
  }
  catch (error) {
    return InternalServerError(res, error);
  }
}

export const getRecruitingParty = async (req: Request, res: Response) => {
  try {
    return SuccessfulResponse(res, { message: "" });
  }
  catch (error) {
    return InternalServerError(res, error);
  }
}

export const getParticipatingParty = async (req: Request, res: Response) => {
  try {
    return SuccessfulResponse(res, { message: "" });
  }
  catch (error) {
    return InternalServerError(res, error);
  }
}

export const getCompletedParty = async (req: Request, res: Response) => {
  try {
    return SuccessfulResponse(res, { message: "" });
  }
  catch (error) {
    return InternalServerError(res, error);
  }
}

export const getFavoriteParty = async (req: Request, res: Response) => {
  try {
    return SuccessfulResponse(res, { message: "" });
  }
  catch (error) {
    return InternalServerError(res, error);
  }
}

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    return SuccessfulResponse(res, { message: "" });
  }
  catch (error) {
    return InternalServerError(res, error);
  }
}

export const verifyUser = async (req: Request, res: Response) => {
  try {
    return SuccessfulResponse(res, { message: "" });
  }
  catch (error) {
    return InternalServerError(res, error);
  }
}

export const modifyUserInfo = async (req: Request, res: Response) => {
  try {
    return SuccessfulResponse(res, { message: "" });
  }
  catch (error) {
    return InternalServerError(res, error);
  }
}