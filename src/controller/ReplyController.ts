import { Request, Response } from "express";
import ReplyServices from "../services/ReplyServices";
import { threadId } from "worker_threads";

export default new (class ReplyController {
  find(req: Request, res: Response) {
    ReplyServices.find(req, res);
  }
  // create(req: Request, res: Response) {
  //   ReplyServices.create(req, res);
  // }

  async create(req: Request, res: Response) {
    try {
      const loginSession = res.locals.session;

      let data;
      if (!req.file) {
        data = {
          content: req.body.content,
          user: loginSession.id,
          thread: req.body.thread,
        };
      } else {
        data = {
          content: req.body.content,
          image: req.file.filename,
          user: loginSession.id,
          thread: req.body.thread,
        };
      }

      const response = await ReplyServices.create(data);
      res.status(201).json(response);
    } catch (error) {
      res.status(error.status).json(error.message);
    }
  }

  async findReplyByThread(req: Request, res: Response): Promise<Response> {
    try {
      const threadId = req.query.threadId as string;
      console.log(threadId);
      const response = await ReplyServices.findReplyByThread(Number(threadId));

      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
})();
