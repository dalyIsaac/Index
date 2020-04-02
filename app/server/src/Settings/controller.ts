import * as Model from "./model";

import { Request, Response } from "express";

import { OK } from "http-status-codes";
import settings from "@index/api/settings";

type Settings = ReturnType<typeof settings["GET"]>;

export const getSettings = async (
  req: Request,
  res: Response,
): Promise<Response<Settings>> => {
  const result = await Model.getSettings();
  return res.status(OK).json(result);
};
