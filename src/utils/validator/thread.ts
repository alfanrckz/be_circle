import joi = require("joi");

export const createThreadSchema = joi.object({
  content: joi.string().allow(null),
  image: joi.string().allow(null).optional(),
  user: joi.number().required(),
});
export const updateThreadSchema = joi.object({
  content: joi.string().optional(),
  image: joi.string().optional(),
  updated_at: joi.date().default(new Date()),
});
