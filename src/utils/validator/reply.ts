import * as Joi from "joi";

export const replySchema = Joi.object().keys({
  content: Joi.string().allow().optional(),
  image: Joi.string().allow().optional(),
  user: Joi.number().required(),
  thread: Joi.number(),
});
