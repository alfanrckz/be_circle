import { Request, Response } from "express";
import FollowServices from "../services/FollowServices";
import { boolean } from "joi";

export default new (class FollowController {
  async getFollow(req: Request, res: Response) {
    try {
      const response = await FollowServices.getFollow(res.locals.session.id);
      res.status(200).json(response);
    } catch (error) {
      throw new error(error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async follow(req: Request, res: Response) {
    try {
      const userId = res.locals.session.id;
      const response = await FollowServices.follow(userId, req.body);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async unfollow(req: Request, res: Response) {
    try {
      // const following = typeof req.query.following === 'string' ? req.query.following : '';
      const follower = req.query.follow;
      const following = res.locals.session.id.toString();
      const response = await FollowServices.unfollow(following, follower);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
})();
