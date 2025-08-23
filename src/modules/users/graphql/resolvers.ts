import { Request, Response } from "express";
import { QueryServices } from "../services/query.services";
import { decodeUserDataFromToken } from "../../../middlewares";
import { User } from "../user.entity";
import { MutationServices } from "../services/mutation.services";

export const userResolvers = {
  Query: {
    user: async (
      _: any,
      { id }: { id: string },
      { req, res }: { req: Request; res: Response }
    ) => {
      const result = await QueryServices.findOne(id);
      return result;
    },
    users: async (
      _: any,
      {},
      { req, res }: { req: Request; res: Response }
    ) => {
      const result = await QueryServices.findManyUsers();
      return result;
    },
    userProfile: async (
      _: any,
      {},
      { req, res }: { req: Request; res: Response }
    ) => {
      const decodeUserData = await decodeUserDataFromToken(req, res);
      if (decodeUserData.is_error) {
        return decodeUserData;
      }
      const data = decodeUserData.data as User;
      const id = String(data.id);
      const result = await QueryServices.findOne(id);
      return result;
    },
  },

  Mutation: {
    userRegister: async (
      _: any,
      { data }: { data: User },
      { req, res }: { req: Request; res: Response }
    ) => {
      const result = await MutationServices.userRegister(data);
      return result;
    },

    userLogin: async (
      _: any,
      { data }: { data: User },
      { req, res }: { req: Request; res: Response }
    ) => {
      const { email, password } = data;
      const result = await MutationServices.userLogin(String(email), password);
      return result;
    },

    updateProfile: async (
      _: any,
      { data }: { data: User },
      { req, res }: { req: Request; res: Response }
    ) => {
      const decodeUserData = await decodeUserDataFromToken(req, res);
      if (decodeUserData.is_error) {
        return decodeUserData;
      }
      const _data = decodeUserData.data as User;
      const userId = String(_data.id);

      const result = await MutationServices.updateUser(userId, data);
      return result;
    },

    deleteUser: async (
      _: any,
      { id }: { id: string },
      { req, res }: { req: Request; res: Response }
    ) => {
      const decodeUserData = await decodeUserDataFromToken(req, res);
      if (decodeUserData.is_error) {
        return decodeUserData;
      }

      const result = await MutationServices.deleteUser(id);
      return result;
    },
  },
};
