import { Repository } from "typeorm";
import { Like } from "../entity/Like";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { createLikeSchema } from "../utils/validator/like";

export default new (class LikeServices {
  private readonly likeRepository: Repository<Like> =
    AppDataSource.getRepository(Like);

  async find(req: Request, res: Response): Promise<Response> {
    try {
      const like = await this.likeRepository.find({
        relations: ["user", "thread"],
      });
      return res.status(200).json({
        message: "Success",
        data: like,
      });
    } catch (error) {
      return res.status(500).json({
        error: "Error while finding like",
        message: error,
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = req.body;
      const { error, value } = createLikeSchema.validate(data);
      if (error) return res.status(400).json(error.details[0].message);

      const loginSession = res.locals.session;
      const likeSelected = await this.likeRepository.findOne({
        where: {
          user: {
            id: loginSession.id,
          },
          thread: {
            id: value.thread,
          },
        },
      });

      // unlike handle
      if (likeSelected) {
        await this.likeRepository.remove(likeSelected);
        return res.status(200).json({
          message: "Like removed succesfully",
        });
      }

      const like = this.likeRepository.create({
        thread: value.thread,
        user: {
          id: loginSession.id,
        },
      });

      const response = await this.likeRepository.save(like);
      return res.status(200).json({
        message: "Like created succesfully",
        data: response,
      });
    } catch (error) {
      return res.status(500).json({
        error: "Error while creating like",
        message: error,
      });
    }
  }

})();
