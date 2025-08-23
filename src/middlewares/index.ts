import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import {
  handleErrorOneResponse,
  handleSuccessOneResponse,
} from "../utils/index";
import { User } from "../modules/users/user.entity";
import { IOneResponse } from "../types/base";

export const accessAuthenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      res.status(400).json(
        handleErrorOneResponse({
          code: "UNAUTHENTICATE",
          message: "Unauthencate",
          error: {},
        })
      );
      return;
    }
    token = token.replace("Bearer ", "");

    const decodeData = jwt.verify(token, "abc") as User;
    const userId = String(decodeData?.id);
    if (!req.body) req.body = {};
    req.body.userId = userId;
    next();
  } catch (error: any) {
    res.status(500).json(
      handleErrorOneResponse({
        code: "INTERNAL_SERVER_ERROR",
        error: error,
        message: error.message,
      })
    );
  }
};

export const decodeUserDataFromToken = async (
  req: Request,
  res: Response
): Promise<IOneResponse> => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return handleErrorOneResponse({
        code: "UNAUTHENTICATE",
        message: "Unauthencate",
        error: {},
      });
    }
    token = token.replace("Bearer ", "");

    const decodeData = jwt.verify(
      token,
      process.env.JWT_SECRET || "jwt_secret"
    ) as User;
    return handleSuccessOneResponse({
      code: "SUCCESS",
      message: "Verify token success",
      data: decodeData,
    });
  } catch (error: any) {
    return handleErrorOneResponse({
      code: "INTERNAL_SERVER_ERROR",
      error: error,
      message: error.message,
    });
  }
};
