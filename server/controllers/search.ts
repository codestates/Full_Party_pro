import { Request, Response } from "express";
import { InternalServerError, SuccessfulResponse } from "./functions/response";
import { searchPartiesByKeyword, searchPartiesByTagName, checkIsRead } from './functions/sequelize';

export const searchByTagNameOrKeyword = async (req: Request, res: Response) => {
  try {
    const { tagName, keyword, region, userId } = req.query;
    const notification = await checkIsRead(Number(userId));
    if (keyword) {
      const result = await searchPartiesByKeyword(String(keyword), String(region), Number(userId));
      return SuccessfulResponse(res, { message: "Successfully Searched By Keyword", result, notification });
    }
    else if (tagName) {
      const result = await searchPartiesByTagName(String(tagName), String(region), Number(userId));
      return SuccessfulResponse(res, { message: "Successfully Searched By Tag", result, notification });
    }
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};