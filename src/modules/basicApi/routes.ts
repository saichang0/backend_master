import express, { Request, Response } from "express";
import { handleSuccessOneResponse } from "../../utils/index";

const basicApiRoute = express();

basicApiRoute.get("/api", (req: Request, res: Response) => {
  console.log("Received a request at /");
  res
    .status(200)
    .json(
      handleSuccessOneResponse({
        code: "SUCCESS_ONE_RESPONSE",
        message: "Good job for success one response",
        data: {},
      })
    );
});

let userDatas: any[] = [];

basicApiRoute.get("/users", (req: Request, res: Response) => {
  res.send({ total: userDatas.length, users: userDatas });
});

basicApiRoute.post("/users", (req: Request, res: Response) => {
  const user = req.body;
  userDatas.push(user);
  res.send({ message: "User created successfully", user });
});

basicApiRoute.put("/users/:id", (req: Request, res: any) => {
  const userId = req.params.id;
  const updatedUser = req.body;
  const userIndex = userDatas.findIndex((user) => user.id == userId);
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  userDatas[userIndex] = updatedUser;
  return res
    .status(200)
    .json({ message: "User updated successfully", user: updatedUser });
});

export default basicApiRoute;
