import { Response } from "express";

export const internalServerError = (res: Response, error: any) => {
  return res.status(500).json({ message: `Internal Server Error: ${error}` });
}