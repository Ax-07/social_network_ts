import { Response } from "express";

export const apiSuccess = (res: Response, message: string, data: unknown = {}, statusCode: number = 200) => {
  return res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};

export const apiError = (res: Response, message: string, error: unknown = {}, statusCode: number = 400) => {
  return res.status(statusCode).json({
    status: "error",
    message,
    error,
  });
};
