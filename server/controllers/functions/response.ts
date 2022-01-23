import { Response } from "express";

export const InternalServerError = (res: Response, error: any) => {
  res.status(500).json({ message: `Internal Server Error: ${error}` });
};

export const SuccessfulResponse = (res: Response, payload: any) => {
  res.status(200).json(payload);
};

export const FailedResponse = (res: Response, statusCode: number, message: string) => {
  res.status(statusCode).json({ message });
};