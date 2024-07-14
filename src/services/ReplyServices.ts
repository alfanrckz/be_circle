import { Repository } from "typeorm";
import { Reply } from "../entity/Reply";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { replySchema } from "../utils/validator/reply";
import { validate } from "../utils/validator/validation";
import cloudinary from "../libs/cloudinary";
import { threadId } from "worker_threads";

export default new (class ReplyServices {
  private readonly replyRepository: Repository<Reply> =
    AppDataSource.getRepository(Reply);
  async find(req: Request, res: Response) {
    try {
      const reply = await this.replyRepository.find({
        relations: ["user", "thread"],
        order: {
          id: "DESC",
        },
      });
      return res.status(200).json({
        message: "Success",
        data: reply,
      });
    } catch (error) {
      return res.status(500).json({
        error: "Error while finding reply",
        message: error,
      });
    }
  }

  // async create(req: Request, res: Response) {
  //   try {
  //     const loginSession = res.locals.session;
  //     console.log("loginSession", loginSession);

  //     const data = req.body;

  //     const { error, value } = replySchema.validate(data);
  //     const replies = this.replyRepository.create({
  //       content: value.content,
  //       image: value.file_reply,
  //       thread: {
  //         id: value.thread,
  //       },
  //       user: {
  //         id: loginSession.id,
  //       },
  //     });
  //     console.log("reply", replies);
  //     if (error) {
  //       return res.status(400).json(error.details[0].message);
  //     }

  //     const response = await this.replyRepository.save(replies);
  //     console.log("response", response);
  //     return res.status(200).json({
  //       message: "Success",
  //       response,
  //     });
  //   } catch (error) {
  //     return res.status(500).json({
  //       error: "Error while creating reply",
  //       message: error,
  //     });
  //   }
  // }

  async create(data) {
    const isValid = validate(replySchema, data);

    let valid;
    if (data.image) {
      cloudinary.config();
      const upFile = await cloudinary.upload(isValid.image);

      valid = {
        content: isValid.content,
        image: upFile.secure_url,
        user: isValid.user,
        thread: isValid.thread,
      };
    } else {
      valid = {
        content: isValid.content,
        user: isValid.user,
        thread: isValid.thread,
      };
    }
    // console.log({ message: "ini servise", valid });

    const response = await this.replyRepository.save(valid);
    return {
      message: "Your Reply is created",
      data: response,
    };
  }

  async findReplyByThread(threadId: number): Promise<any> {
    try {
      const response = await this.replyRepository.find({
        where: {
          thread: {
            id: threadId,
          },
        },
        order: {
          id: "DESC",
        },
        relations: {
          user: true,
        },
      });

      return response;
    } catch (error) {
      throw error;
    }
  }
})();
