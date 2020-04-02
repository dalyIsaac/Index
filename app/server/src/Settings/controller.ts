import * as Model from "./model";

import { BAD_REQUEST, OK } from "http-status-codes";
import { Request, Response } from "express";

import settings from "@index/api/settings";

type GetSettings = ReturnType<typeof settings["GET"]>;
type PostSettings = ReturnType<typeof settings["POST"]>;

export const getSettings = async (
  req: Request,
  res: Response,
): Promise<Response<GetSettings>> => {
  const result = await Model.getSettings();
  return res.status(OK).json(result);
};

export const postSettings = async (
  req: Request,
  res: Response,
): Promise<Response<PostSettings>> => {
  const result = await Model.postSettings(req.body);
  if (typeof result === "string") {
    return res.status(BAD_REQUEST).json(result);
  }
  return res.status(OK).json(result);
};
