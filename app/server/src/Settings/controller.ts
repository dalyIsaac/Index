import * as Model from "./model";

import { BAD_REQUEST, OK } from "http-status-codes";
import { Request, Response } from "express";

import settings from "@index/api/settings";

type GetSettings = ReturnType<typeof settings["GET"]>;

export const getSettings = async (
  req: Request,
  res: Response,
): Promise<Response<GetSettings>> => {
  const result = await Model.getSettings();
  return res.status(OK).json(result);
};

type PostSettings = ReturnType<typeof settings["POST"]>;

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

type GetDirectorySettings = ReturnType<typeof settings["directory"]["GET"]>;

export const getDirectory = async (
  req: Request,
  res: Response,
): Promise<Response<GetDirectorySettings>> => {
  const dir = await Model.getDirectory();
  return res.status(OK).json(dir);
};

type GetThemeSettings = ReturnType<typeof settings["theme"]["GET"]>;

export const getTheme = async (
  req: Request,
  res: Response,
): Promise<Response<GetThemeSettings>> => {
  const theme = await Model.getTheme();
  return res.status(OK).json(theme);
};
