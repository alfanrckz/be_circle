import * as bcrypt from "bcrypt";
import { Equal, Repository } from "typeorm";
import * as jwt from "jsonwebtoken";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { loginSchema, registerSchema } from "../utils/validator/auth";
import { Request, Response } from "express";
import ResponseError from "../error/responseError";
import { validate } from "../utils/validator/validation";
import { Follow } from "../entity/Follow";

export default new (class Authservice {
  private readonly AuthRepository: Repository<User> =
    AppDataSource.getRepository(User);

  async register(reqBody: any): Promise<any> {
    try {
      // console.log(reqBody);
      const { value, error } = registerSchema.validate(reqBody);
      if (error) {
        throw new Error("Email is already registered");
      }

      const isEmailRegistered = await this.AuthRepository.count({
        where: {
          email: reqBody.email,
        },
      });
      if (isEmailRegistered > 0) {
        throw new Error("Email is already registered");
      }

      const password = await bcrypt.hash(reqBody.password, 10);
      // console.log(password);

      const user = this.AuthRepository.create({
        fullName: value.fullName,
        username: value.username,
        email: value.email,
        password: password,
      });
      // console.log(user);

      const data = await this.AuthRepository.save(user);
      // console.log(data);
      return {
        message: "Registered succesfull",
        user: user,
      };
    } catch (error) {
      throw new Error("Something went wrong on the server");
    }
  }

  async login(reqBody: Request) {
    const isValid = validate(loginSchema, reqBody);

    const chkUser = await this.AuthRepository.findOne({
      where: { email: isValid.email },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        password: true,
      },
    });
    if (!chkUser) throw new ResponseError(401, "Username not registered yet!");

    const isEqual = await bcrypt.compare(isValid.password, chkUser.password);
    if (!isEqual)
      throw new ResponseError(401, "Username or Password is not correct!");

    const token = jwt.sign(
      { id: chkUser.id, username: chkUser.username },
      process.env.SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );
    return {
      message: "Login success",
      user: {
        id: chkUser.id,
        fullName: chkUser.fullName,
        username: chkUser.username,
        email: chkUser.email,
      },
      token: token,
    };
  }


  async check(req: Request, res: Response): Promise<Response | void> {
    try {
      const userLogin = res.locals.session.id;
      const user = await this.AuthRepository.findOne({
        where: {
          id: userLogin,
        },
        relations: {
          follower: true,
          following: true,
        }
      });

      const follower = await AppDataSource.getRepository(Follow).find({
        where: {
          follower: Equal(userLogin),
        },
        relations:{
          following: true
        }
      })
      const following = await AppDataSource.getRepository(Follow).find({
        where: {
          following: Equal(userLogin),
        },
        relations:{
          follower: true
        }
      })

      const data = {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        picture: user.picture,
        cover_photo: user.cover_photo,
        bio: user.bio,
        followers_count: follower,
        followings_count: following
      } 

      return res.status(200).json({ message: "Token is valid!", data
    });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
  
})();
