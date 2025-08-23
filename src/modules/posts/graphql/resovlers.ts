import { Request, Response } from "express";
import { PostQueryServices } from "../services/query.services";
import { User } from "../../users/user.entity";
import { PostMutationServices } from "../services/mutation.services";
import { Post } from "../post.entity";
import { decodeUserDataFromToken } from "../../../middlewares";

export const postResolvers = {
  Query: {
    post: async (
      _: any,
      { id }: { id: number },
      { req, res }: { req: Request; res: Response }
    ) => {
      const result = await PostQueryServices.getOne(id);
      return result;
    },
    posts: async (
      _: any,
      {
        keyword,
        page = 1,
        limit = 10,
      }: { keyword: string; page: number; limit: number },
      { req, res }: { req: Request; res: Response }
    ) => {
      const result = await PostQueryServices.getMany(keyword, page, limit);
      return result;
    },
  },

  Mutation: {
    createPost: async (
      _: any,
      { data }: { data: Post },
      { req, res }: { req: Request; res: Response }
    ) => {
      const decodeUserData = await decodeUserDataFromToken(req, res);
      if (decodeUserData.is_error) {
        return decodeUserData;
      }
      const _data = decodeUserData.data as User;
      const id = Number(_data.id);
      const postData = {
        title: data?.title,
        details: data?.details,
        url: data?.url,
        userId: id,
      } as Post;

      const result = await PostMutationServices.create(postData);
      return result;
    },

    deletePost: async (
      _: any,
      { id }: { id: number },
      { req, res }: { req: Request; res: Response }
    ) => {
      const decodeUserData = await decodeUserDataFromToken(req, res);
      if (decodeUserData.is_error) {
        return decodeUserData;
      }
      const _data = decodeUserData.data as User;
      const userId = Number(_data.id);
      const result = await PostMutationServices.delete(id, userId);
      return result;
    },
    updatePost: async (
      _: any,
      { id, data }: { id: number; data: Post },
      { req, res }: { req: Request; res: Response }
    ) => {
      const decodeUserData = await decodeUserDataFromToken(req, res);
      if (decodeUserData.is_error) {
        return decodeUserData;
      }
      const _data = decodeUserData.data as User;
      const userId = Number(_data.id);
      const result = await PostMutationServices.update(data, id, userId);

      return result;
    },
  },
};
