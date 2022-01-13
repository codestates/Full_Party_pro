import { Request, Response } from "express";
import { InternalServerError, SuccessfulResponse, FailedResponse } from "./functions/response";
import { generateAccessToken, verifyAccessToken, setCookie, clearCookie } from "./functions/token";

export const searchByTagName = async (req: Request, res: Response) => {
  try {
    return SuccessfulResponse(res, { message: "" });
  }
  catch (error) {
    return InternalServerError(res, error);
  }
}

export const searchByKeyword = async (req: Request, res: Response) => {
  try {
    return SuccessfulResponse(res, { message: "" });
  }
  catch (error) {
    return InternalServerError(res, error);
  }
}