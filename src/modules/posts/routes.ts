import { title } from "process";
import express, { Request, Response } from "express";
import { handleErrorOneResponse } from "../../utils/index";
import { accessAuthenticate } from "../../middlewares";
import { Post } from "./post.entity";
import { PostMutationServices } from "./services/mutation.services";
import { PostQueryServices } from "./services/query.services";

const postRoutes = express();

postRoutes.post(
  "/create",
  accessAuthenticate,
  async (req: Request, res: Response) => {
    try {
      const data = req.body as Post;
      const postData = {
        title: data?.title,
        details: data?.details,
        url: data?.url,
        userId: data?.userId,
      } as Post;

      const result = await PostMutationServices.create(postData);
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
  }
);

postRoutes.put(
  "/update/:id",
  accessAuthenticate,
  async (req: Request, res: Response) => {
    try {
      const data = {
        title: req.body.title,
        details: req.body.details,
        url: req.body.url,
      } as Post;
      const id = Number(req.params.id);
      const userId = Number(req.body.userId);

      const result = await PostMutationServices.update(data, id, userId);

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
  }
);

postRoutes.delete(
  "/delete/:id",
  accessAuthenticate,
  async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const userId = Number(req.body.userId);

      const result = await PostMutationServices.delete(id, userId);

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
  }
);

postRoutes.get("/get-one/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const result = await PostQueryServices.getOne(id);

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

postRoutes.get("/get-many", async (req: Request, res: Response) => {
  try {
    const keyword = String(req.query.q);
    const page = Number(req.query.page || "1");
    const limit = Number(req.query.limit || "20");
    const result = await PostQueryServices.getMany(keyword, page, limit);
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

export default postRoutes;
