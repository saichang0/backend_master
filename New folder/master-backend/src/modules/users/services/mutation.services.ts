import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AppDataSource } from "../../../database/dbConnecct";
import {
  handleErrorManyResponse,
  handleErrorOneResponse,
  handleSuccessManyResponse,
  handleSuccessOneResponse,
} from "../../../utils/index";
import { User } from "../user.entity";
import { IManyResponse, IOneResponse } from "./../../../types/base/index";

export class MutationServices {
  static userRepository = AppDataSource.getRepository(User);

  static async updateUser(id: string, data: User): Promise<IOneResponse> {
    try {
      // Get user id from client using query
      const userId = Number(id);
      // Check user id required
      if (!userId) {
        return handleErrorOneResponse({
          code: "BAD_REQUEST",
          message: "User id must required",
          error: {},
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
        });
      }

      if (data.email) {
        const emailExisting = await this.userRepository.findOneBy({
          email: data.email,
        });
        if (emailExisting && emailExisting.id !== userId) {
          return handleErrorOneResponse({
            code: "EMAIL_ALREADY_EXIST",
            message: "This email has already in system",
            error: {},
          });
        }
      }

      if (data.password) {
        const hashPW = await bcrypt.hash(data.password, 10);
        data.password = hashPW;
      }

      // const userUpdate = await userRepository.update(userId, data);
      const userChange = this.userRepository.merge(user, data);
      const userUpdate = await this.userRepository.save(userChange);

      return handleSuccessOneResponse({
        code: "SUCCESS",
        message: "Update user data success",
        data: userUpdate,
      });
    } catch (error: any) {
      return handleErrorOneResponse({
        code: "INTERNAL_SERVER_ERROR",
        error: error,
        message: error.message,
      });
    }
  }

  static async createUser(data: User): Promise<IOneResponse> {
    try {
      // Validate data
      if (!data.fullname) {
        return handleErrorOneResponse({
          code: "BAD_REQUEST",
          message: "fullname must required",
          error: {},
        });
      }
      if (!data.email) {
        return handleErrorOneResponse({
          code: "BAD_REQUEST",
          message: "email must required",
          error: {},
        });
      }
      if (!data.password) {
        return handleErrorOneResponse({
          code: "BAD_REQUEST",
          message: "Password must required",
          error: {},
        });
      }

      // Check email already exist
      const existEmail = await this.userRepository.findOne({
        where: { email: data.email },
      });
      if (existEmail) {
        return handleErrorOneResponse({
          code: "EMAIL_ALREADY_EXIST",
          message: "This email has already in system",
          error: {},
        });
      }

      //   Hash password
      const hashPW = await bcrypt.hash(data.password, 10);
      data.password = hashPW;

      // Insert user data into database
      const createUser = await this.userRepository.save(data);

      // return user data to client
      return handleSuccessOneResponse({
        code: "SUCCESS",
        message: "Create user success",
        data: { ...createUser, password: null },
      });
    } catch (error: any) {
      return handleErrorOneResponse({
        code: "INTERNAL_SERVER_ERROR",
        error: error,
        message: error.message,
      });
    }
  }

  static async userRegister(data: User): Promise<IOneResponse> {
    try {
      // Validate data
      if (!data.fullname) {
        return handleErrorOneResponse({
          code: "BAD_REQUEST",
          message: "fullname must required",
          error: {},
        });
      }
      if (!data.email) {
        return handleErrorOneResponse({
          code: "BAD_REQUEST",
          message: "email must required",
          error: {},
        });
      }
      if (!data.password) {
        return handleErrorOneResponse({
          code: "BAD_REQUEST",
          message: "Password must required",
          error: {},
        });
      }

      // Check email already exist
      const existEmail = await this.userRepository.findOne({
        where: { email: data.email },
      });
      if (existEmail) {
        return handleErrorOneResponse({
          code: "EMAIL_ALREADY_EXIST",
          message: "This email has already in system",
          error: {},
        });
      }

      //   Hash password
      const hashPW = await bcrypt.hash(data.password, 10);
      data.password = hashPW;

      // Insert user data into database
      const createUser = await this.userRepository.save(data);

      // return user data to client
      return handleSuccessOneResponse({
        code: "SUCCESS",
        message: "Register success",
        data: { ...createUser, password: null },
      });
    } catch (error: any) {
      return handleErrorOneResponse({
        code: "INTERNAL_SERVER_ERROR",
        error: error,
        message: error.message,
      });
    }
  }

  static async deleteUser(id: string): Promise<IOneResponse> {
    try {
      // Get user id from client using query
      const userId = Number(id);
      // Check user id required
      if (!userId) {
        return handleErrorOneResponse({
          code: "BAD_REQUEST",
          message: "User id must required",
          error: {},
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
        });
      }

      // Delete user data
      await this.userRepository.delete(userId);
      // await userRepository.remove(user);

      return handleSuccessOneResponse({
        code: "SUCCESS",
        message: "Delete user data success",
        data: {},
      });
    } catch (error: any) {
      return handleErrorOneResponse({
        code: "INTERNAL_SERVER_ERROR",
        error: error,
        message: error.message,
      });
    }
  }

  static async userLogin(
    email: string,
    password: string
  ): Promise<IOneResponse> {
    try {
      // 1. validate data input
      if (!email || !password) {
        return handleErrorOneResponse({
          code: "BAD_REQUEST",
          message: "Email or password must required",
          error: {},
        });
      }

      //   2. Find email already in system
      const existingEmail = await this.userRepository.findOneBy({ email });
      if (!existingEmail) {
        return handleErrorOneResponse({
          code: "BAD_REQUEST",
          message: "Email or password incorrect",
          error: {},
        });
      }
      // 3. Compare password
      const comparePassword = await bcrypt.compare(
        password,
        existingEmail.password
      );
      if (!comparePassword) {
        return handleErrorOneResponse({
          code: "BAD_REQUEST",
          message: "Email or password incorrect",
          error: {},
        });
      }
      // 4. Generate token (Key)
      const payload = {
        id: existingEmail.id,
        fullname: existingEmail.fullname,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET || "jwt_secret", {
        expiresIn: "1d",
      });

      // 5. Return data to client
      return handleSuccessOneResponse({
        code: "SUCCESS",
        data: {
          user: { ...existingEmail, password: null },
          token,
        },
        message: "Login success",
      });
    } catch (error: any) {
      return handleErrorOneResponse({
        code: "INTERNAL_SERVER_ERROR",
        message: error?.message,
        error,
      });
    }
  }
}
