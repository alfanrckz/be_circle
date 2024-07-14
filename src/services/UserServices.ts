import { Repository, EntityManager } from "typeorm";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import FollowServices from "./FollowServices";
import ResponseError from "../error/responseError";
import * as bcrypt from "bcrypt";
import cloudinary from "../libs/cloudinary";

export default new (class UserService {
  private readonly userRepository: Repository<User> =
    AppDataSource.getRepository(User);

  async find(req: Request, res: Response) {
    try {
      const manager = AppDataSource.createEntityManager();

      const users = await this.userRepository.find({
        select: [
          "id",
          "username",
          "email",
          "fullName",
          "bio",
          "picture",
          "cover_photo",
        ],
        relations: {
          follower: true,
          following: true,
        },
      });

      return res.status(200).json({
        message: "Success Getting all users",
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        error: "Error while finding users",
      });
    }
  }

  async getUserByid(id: number) {
    try {
     const response = await this.userRepository.findOne({
       where: {id},
       relations: {
         likes: true,
         replies: true,
         following: true,
         follower: true,
         threads: true
       }
     })
     if(!response) return {message: "user not found"}
     const isFollow = await FollowServices.getFollow( id)
     const data = {
      id: response.id,
      username: response.username,
      email: response.email,
      fullName: response.fullName,
      bio: response.bio,
      picture: response.picture,
      cover_photo: response.cover_photo,
      isFollow: isFollow,
      followerCount: response.follower.length,
      followingCount: response.following.length
     }
     return {
      message: "Success getting user",
      data: data
     }
    } catch (error) {
      return {message: "something error while getting user"}
    }
  }
  async updateUser(id: number, session: number, data) {
    if (session !== id)
      throw new ResponseError(404, "Cant update thid user profile");
    let user;

    if (!data.password) {
      user = {
        fullName: data.fullName,
        username: data.username,
        bio: data.bio,
      };
    } else {
      const hash = await bcrypt.hash(data.password, 10);
      user = {
        fullName: data.fullName,
        username: data.username,
        bio: data.bio,
        password: hash,
      };
    }
    await this.userRepository.update({ id }, user);
    return {
      message: "user updated successfully",
      user: data.username,
    };
  }

  async uploadPicture(id, session, picture) {
    if (session !== id)
      throw new ResponseError(403, "Cant update another user profile");
    if (!picture) throw new ResponseError(400, "Picture is required");
    cloudinary.config();
    const upload = (await cloudinary.upload(picture)).secure_url;
    await this.userRepository.update({ id }, { picture: upload });
    return {
      message: "picture uploaded successfully",
    };
  }

  async uploadCover(id, session, cover_photo) {
    if (session !== id)
      throw new ResponseError(403, "Cant update another user profile");
    if (!cover_photo) throw new ResponseError(400, "Cover is required");
    cloudinary.config();
    const upload = (await cloudinary.upload(cover_photo)).secure_url;

    await this.userRepository.update({ id }, { cover_photo: upload });
    return {
      message: "cover uploaded successfully",
    };
  }
})();
