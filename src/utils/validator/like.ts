import * as Joi from "joi";

export const createLikeSchema = Joi.object({
  user: Joi.number(),
  thread: Joi.number(),
});
