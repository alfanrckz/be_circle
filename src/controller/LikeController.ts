import { Request, Response } from "express";
import LikeServices from "../services/LikeServices";

export default new (class LikeController {
  async findAll(req: Request, res: Response) {
    LikeServices.find(req, res);
  }

  async create(req: Request, res: Response) {
    LikeServices.create(req, res);
  }

})();
