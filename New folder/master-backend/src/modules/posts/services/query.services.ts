import { title } from "process";
import { AppDataSource } from "../../../database/dbConnecct";
import { Post } from "../post.entity";
import { IManyResponse, IOneResponse } from "../../../types/base";
import {
  handleErrorManyResponse,
  handleErrorOneResponse,
  handleSuccessManyResponse,
  handleSuccessOneResponse,
} from "../../../utils";

export class PostQueryServices {
  static postRepository = AppDataSource.getRepository(Post);

  static async getOne(id: number): Promise<IOneResponse> {
    try {
      // Find post first
      const existingPost = await this.postRepository.findOneBy({ id });
      if (!existingPost) {
        return handleErrorOneResponse({
          code: "NOT_FOUND",
          message: "Post not found",
          error: {},
        });
      }

      return handleSuccessOneResponse({
        code: "SUCCESS",
        message: "Get post success",
        data: existingPost,
      });
    } catch (error: any) {
      return handleErrorOneResponse({
        code: "INTERNAL_SERVER_ERROR",
        error: error,
        message: error.message,
      });
    }
  }

  static async getMany(
    keyword: string,
    page: number,
    limit: number
  ): Promise<IManyResponse> {
    try {
      const skip = (page - 1) * limit;
      const queryBuilder = this.postRepository.createQueryBuilder("post");
      if (keyword) {
        queryBuilder
          .where("post.title LIKE :keyword", { keyword: `%${keyword}%` })
          .orWhere("post.details LIKE :keyword", { keyword: `%${keyword}%` });
      }

      const totalPost = await queryBuilder.getCount();
      const posts = await queryBuilder
        .leftJoinAndSelect("post.userData", "user")
        .offset(skip)
        .limit(limit)
        .orderBy("post.created_at", "DESC")
        .getMany();
        
      return handleSuccessManyResponse({
        code: "SUCCESS",
        message: "Get post success",
        data: posts.map((post) => {
          return { ...post, userData: { ...post.userData, password: null } };
        }),
        total: totalPost,
      });
    } catch (error: any) {
      return handleErrorManyResponse({
        code: "INTERNAL_SERVER_ERROR",
        error: error,
        message: error.message,
      });
    }
  }
}
