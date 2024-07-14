import Joi = require("joi");

export const registerSchema = Joi.object().keys({
  fullName: Joi.string().required(),
  username: Joi.string().required().min(5),
  email: Joi.string().email().required().min(5).max(50),
  password: Joi.string().required().min(5).max(50),
});

export const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
