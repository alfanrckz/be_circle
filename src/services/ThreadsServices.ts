import { Repository } from "typeorm";
import cloudinary from "../libs/cloudinary";
import {
  createThreadSchema,
  updateThreadSchema,
} from "../utils/validator/thread";
import { validate } from "../utils/validator/validation";
import { Threads } from "../entity/Threads";
import { AppDataSource } from "../data-source";
import ResponseError from "../error/responseError";

export default new (class ThreadsServices {
  private readonly threadRepository: Repository<Threads> =
    AppDataSource.getRepository(Threads);

  async getThreads() {
    return this.threadRepository.find({
      order: {
        id: "DESC",
      },
      relations: ["likes", "likes.user", "replies", "user"],
      select: {
        user: {
          fullName: true,
          username: true,
          picture: true,
        },
        likes: {
          id: true,
          user: {
            id: true,
          },
        },

        replies: {
          id: true,
        },
      },
    });
  }

  async createThread(data) {
    const isValid = validate(createThreadSchema, data);

    let valid;
    if (data.image) {
      cloudinary.config();
      const upFile = await cloudinary.upload(isValid.image);
      // console.log("ini upfile", upFile);

      valid = {
        content: isValid.content,
        image: upFile.secure_url,
        user: isValid.user,
      };
    } else {
      valid = {
        content: isValid.content,
        user: isValid.user,
      };
    }
    // console.log({ message: "ini servise", valid });

    const response = await this.threadRepository.save(valid);
    return {
      message: "Your Thread is created",
      data: response,
    };
  }

  async getThread(id) {
    return this.threadRepository.findOne({
      where: id,
      relations: ["likes", "likes.user", "replies", "user", "replies.user", ],
      select: {
        user: {
          fullName: true,
          username: true,
          picture: true,
        },
        likes: {
          id: true,
          user: {
            id: true,
          },
        },

        replies: {
          id: true,
          created_at: true,
          content: true,
          user: {
            id: true,
            fullName: true,
            username: true,
            picture: true,
          },
        },
    
    }});
  }

  async updateThread(data, id) {
    // console.log(data);

    const isValid = validate(updateThreadSchema, data);
    let valid;
    if (data.image && data.content) {
      cloudinary.config();
      const upFile = await cloudinary.upload(isValid.image);

      valid = {
        content: isValid.content,
        image: upFile.secure_url,
        updated_at: isValid.updated_at,
      };
    } else if (!data.image && data.content) {
      valid = {
        content: isValid.content,
        updated_at: isValid.updated_at,
      };
    } else if (data.image && data.content) {
      cloudinary.config();
      const upFile = await cloudinary.upload(isValid.image);

      valid = {
        image: upFile.secure_url,
        updated_at: isValid.updated_at,
      };
    } else {
      throw new ResponseError(400, "content or image is required");
    }

    // console.log("ini service", valid);
    // console.log(id);

    await this.threadRepository.update({ id: id.id }, valid);

    return {
      message: "Your Thread is update",
      data: valid,
    };
  }

  async delete(id) {
    const chkThread = await this.threadRepository.countBy(id);
    if (chkThread === 0) throw new ResponseError(404, "Not found");

    const response = await this.threadRepository.delete(id);
    return {
      messagae: "Thread is Deleted",
    };
  }
})();
