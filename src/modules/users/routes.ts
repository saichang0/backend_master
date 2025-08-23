import jwt from "jsonwebtoken";
import express, { Request, Response } from "express";
import {
  handleErrorManyResponse,
  handleErrorOneResponse,
  handleSuccessManyResponse,
  handleSuccessOneResponse,
} from "../../utils/index";
import { AppDataSource } from "../../database/dbConnecct";
import { User } from "./user.entity";
import { QueryServices } from "./services/query.services";
import { MutationServices } from "./services/mutation.services";
import { accessAuthenticate } from "../../middlewares";

const userRoute = express();

userRoute.get("/get-many", async (req: Request, res: Response) => {
  const result = await QueryServices.findManyUsers();
  res.status(result.status_code).json(result);
});

userRoute.post("/create", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await MutationServices.createUser(data);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json(
      handleErrorManyResponse({
        code: "INTERNAL_SERVER_ERROR",
        error: error,
        message: error.message,
      })
    );
  }
});

userRoute.post("/register", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await MutationServices.userRegister(data);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json(
      handleErrorManyResponse({
        code: "INTERNAL_SERVER_ERROR",
        error: error,
        message: error.message,
      })
    );
  }
});

userRoute.get("/profile", accessAuthenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const result = await QueryServices.findOne(userId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json(
      handleErrorManyResponse({
        code: "INTERNAL_SERVER_ERROR",
        error: error,
        message: error.message,
      })
    );
  }
});

userRoute.put("/update/profile", accessAuthenticate, async (req: Request, res: Response) => {
  try { 
    const userId = req.body.userId;
    const data = {} as User;
    data.fullname = req.body.fullname;
    data.email = req.body.email;
    data.password = req.body.passord;
    
    const result = await MutationServices.updateUser(userId, data);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json(
      handleErrorManyResponse({
        code: "INTERNAL_SERVER_ERROR",
        error: error,
        message: error.message,
      })
    );
  }
});

// route get one user
userRoute.get("/one/:userId", async (req: Request, res: Response) => {
  try {
    const id = req.params.userId;
    const result = await QueryServices.findOne(id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json(
      handleErrorOneResponse({
        code: "INTERNAL_SERVER_ERROR",
        error: error,
        message: error.message,
      })
    );
  }
});

// route update user
userRoute.put("/update/:userId", async (req: Request, res: Response) => {
  try {
    const id = req.params.userId;
    const data = req.body;
    const result = await MutationServices.updateUser(id, data);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json(
      handleErrorOneResponse({
        code: "INTERNAL_SERVER_ERROR",
        error: error,
        message: error.message,
      })
    );
  }
});

// route delete user
userRoute.delete("/delete/:userId", async (req: Request, res: Response) => {
  try {
    const id = req.params.userId;
    const result = await MutationServices.deleteUser(id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json(
      handleErrorOneResponse({
        code: "INTERNAL_SERVER_ERROR",
        error: error,
        message: error.message,
      })
    );
  }
});

// route user login
userRoute.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await MutationServices.userLogin(email, password);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json(
      handleErrorOneResponse({
        code: "INTERNAL_SERVER_ERROR",
        error: error,
        message: error.message,
      })
    );
  }
});

export default userRoute;
