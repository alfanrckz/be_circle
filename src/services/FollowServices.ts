import { Equal, Repository } from "typeorm";
import { Follow } from "../entity/Follow";
import { AppDataSource } from "../data-source";
import { User } from '../entity/User';
import { Request, response, Response } from "express";
import ResponseError from "../error/responseError";

export default new (class FollowServices {
  private readonly followRepository: Repository<Follow> =
    AppDataSource.getRepository(Follow);

  async getFollow(id) {
    const follower = await AppDataSource.getRepository(User).find({
      where: { following: { follower: Equal(id) } },
      relations: {
        following: true,
      },
    });

    // query(
    //   `
    //   SELECT
    //     u.*,
    //     (SELECT COUNT(*) FROM follows WHERE "followingId" = u.id) AS followerCount,
    //     CASE
    //       WHEN EXISTS (SELECT 1 FROM follows WHERE "followingId" = u.id AND "followerId" = $1) THEN false
    //       ELSE true
    //     END AS isFollowing
    //   FROM
    //     public.user u
    //   INNER JOIN
    //     follows f ON u.id = f."followingId"
    //   WHERE
    //     f."followerId" = $2
    // `,
    //   [id, id]
    // );

    const following = await AppDataSource.getRepository(User).find({
      where: { follower: { following: Equal(id) } },
      relations: {
        follower: true,
      },
    });
    return {
      follower,
      following,
    };
  }

  async follow(userId, reqBody: any) {
    try {
      const checkid = await AppDataSource.getRepository(User).findOne({
        where: { id: Equal(reqBody.following) },
      });
      // console.log("checkid :", checkid);
      if (!checkid) {
        throw new Error("User not found");
      }
      const isFollow = await this.followRepository.count({
        where: {
          follower: Equal(reqBody.following),
          following: Equal(userId),
        },
      });
      if (isFollow > 0) {
        throw new Error("You already follow this user");
      }
      await this.followRepository.save({
        following: userId,
        follower: reqBody.following,
      });
      return {
        message: "Follow Success",
      };
    } catch (error) {
      throw error;
    }
  }
  async unfollow(userId, reqBody) {
    const checkFollower = await AppDataSource.getRepository(User).findOne({
      where: {
        id: userId,
      },
    });
    if (!checkFollower) throw new ResponseError(404, "User not found");

    const isFollow = await this.followRepository.findOne({
      where: {
        follower: Equal(reqBody),
        following: Equal(userId),
      },
    });
    if (!isFollow) throw new ResponseError(404, "You don't follow this user");
    const response = await this.followRepository.delete(isFollow.id);
    return {
      message: "Unfollow Success",
    };
  }
})();
