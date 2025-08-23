import { Request } from "express";
import { AppDataSource } from "../../../database/dbConnecct";
import {
  handleErrorManyResponse,
  handleErrorOneResponse,
  handleSuccessManyResponse,
  handleSuccessOneResponse,
} from "../../../utils/index";
import { User } from "../user.entity";
import { IManyResponse, IOneResponse } from "./../../../types/base/index";
export class QueryServices {
  static userRepository = AppDataSource.getRepository(User);

  static async findManyUsers(): Promise<IManyResponse> {
    try {
      // Count total user data
      const totalUser = await this.userRepository.count({});

      // Get users data
      const users = await this.userRepository.find({});
      return handleSuccessManyResponse({
        code: "SUCCESS",
        message: "Fetch user data success",
        total: totalUser,
        data: users.map((user) => {
          return { ...user, password: null };
        }),
      });
    } catch (error: any) {
      return handleErrorManyResponse({
        code: "INTERNAL_SERVER_ERROR",
        error: error,
        message: error.message,
        status_code: 500,
      });
    }
  }

  static async findOne(id: string): Promise<IOneResponse> {
    try {
      // Get user id from client using query
      const userId = Number(id);
      // Check user id required
      if (!userId) {
        return handleErrorOneResponse({
          code: "BAD_REQUEST",
          message: "User id must required",
          error: {},
          status_code: 400,
        });
      }

      // Get user data by id
      // const user = await userRepository.findOne({ where: { id: userId } as any });
      const user = await this.userRepository.findOneBy({ id: userId });

      // If user data not found or null then return warning
      if (!user) {
        return handleErrorOneResponse({
          code: "BAD_REQUEST",
          message: "User not found",
          error: {},
          status_code: 400,
        });
      }

      return handleSuccessOneResponse({
        code: "SUCCESS",
        message: "Fetch user data success",
        data: { ...user, password: null },
      });
    } catch (error: any) {
      return handleErrorOneResponse({
        code: "INTERNAL_SERVER_ERROR",
        error: error,
        message: error.message,
        status_code: 500,
      });
    }
  }
}
