import { AppDataSource } from "../../../database/dbConnecct";
import { Post } from "../post.entity";
import { IOneResponse } from "../../../types/base";
import {
  handleErrorOneResponse,
  handleSuccessOneResponse,
} from "../../../utils/index";

export class PostMutationServices {
  static postRepository = AppDataSource.getRepository(Post);

  static async create(data: Post): Promise<IOneResponse> {
    try {
      // Validate
      if (!data.title) {
        return handleErrorOneResponse({
          code: "BAD_REQUEST",
          error: {},
          message: "Invalid data",
        });
      }

      // Save post
      const createPost = await this.postRepository.save(data);

      return handleSuccessOneResponse({
        code: "SUCCESS",
        message: "Create post success",
        data: createPost,
      });
    } catch (error: any) {
      return handleErrorOneResponse({
        code: "INTERNAL_SERVER_ERROR",
        error: error,
        message: error.message,
      });
    }
  }

  static async update(
    data: Post,
    id: number,
    userId: number
  ): Promise<IOneResponse> {
    try {
      // Find post first
      const existingPost = await this.postRepository.findOneBy({ id, userId });
      if (!existingPost) {
        return handleErrorOneResponse({
          code: "NOT_FOUND",
          message: "Post not found",
          error: {},
        });
      }

      const _postData = this.postRepository.merge({
        ...existingPost,
        ...data,
      });

      // Update post
      const updatePost = await this.postRepository.save(_postData);

      return handleSuccessOneResponse({
        code: "SUCCESS",
        message: "Update post success",
        data: updatePost,
      });
    } catch (error: any) {
      return handleErrorOneResponse({
        code: "INTERNAL_SERVER_ERROR",
        error: error,
        message: error.message,
      });
    }
  }

  static async delete(id: number, userId: number): Promise<IOneResponse> {
    try {
      // Find post first
      const existingPost = await this.postRepository.findOneBy({ id, userId });
      if (!existingPost) {
        return handleErrorOneResponse({
          code: "NOT_FOUND",
          message: "Post not found",
          error: {},
        });
      }

      // Delete post
      await this.postRepository.delete(id);

      return handleSuccessOneResponse({
        code: "SUCCESS",
        message: "Delete post success",
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
}
