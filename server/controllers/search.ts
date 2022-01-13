import { Request, Response } from "express";
import { InternalServerError, SuccessfulResponse, FailedResponse } from "./functions/response";
import { searchPartiesByKeyword, searchPartiesByTagName } from './functions/sequelize';
import { generateAccessToken, verifyAccessToken, setCookie, clearCookie } from "./functions/token";

// 유저 아이디 넘겨줘야 favorite 검색이 됨.
export const searchByTagNameOrKeyword = async (req: Request, res: Response) => {
  try {
    const { tagName, keyword, region, userId } = req.query;
    if (keyword) {
      const result = await searchPartiesByKeyword(String(keyword), String(region), Number(userId));
      return SuccessfulResponse(res, { message: "Successfully Searched By Keyword", result });
    }
    else if (tagName) {
      const result = await searchPartiesByTagName(String(tagName), String(region), Number(userId));
      return SuccessfulResponse(res, { message: "Successfully Searched By Tag", result });
    }
  }
  catch (error) {
    return InternalServerError(res, error);
  }
};