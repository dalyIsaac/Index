import * as Model from "./model";

import { NOT_FOUND, OK } from "http-status-codes";
import { Request, Response } from "express";

import dirs from "@index/api/dirs";

type HomeDirs = ReturnType<typeof dirs.home.GET>;

export const getHomeDirs = (
  req: Request,
  res: Response,
): Response<HomeDirs> => {
  const homedir = Model.getHomeDirs();
  return res.status(OK).json(homedir);
};

type Dirs = ReturnType<typeof dirs.GET>;

export const getDirs = async (
  req: Request,
  res: Response,
): Promise<Response<Dirs>> => {
  let { path } = req.query;
  if (!path) {
    path = Model.getHomeDirs().homedir;
  }

  const { dirs, errors } = await Model.getDirs(path);
  if (errors) {
    return res.status(NOT_FOUND).json(errors);
  }
  return res.status(OK).json(dirs);
};
