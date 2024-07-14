import { Schema } from "joi";
import { Request } from "express";
import ResponseError from "../../error/responseError";

export const validate = (schema: Schema, req: Request) => {
  const result = schema.validate(req, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (result.error) {
    throw new ResponseError(400, result.error.message);
  } else {
    return result.value;
  }
};
