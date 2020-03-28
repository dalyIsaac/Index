import * as Model from "./model";

import { NOT_FOUND, OK } from "http-status-codes";
import { Request, Response } from "express";

export const getHomeDirs = (req: Request, res: Response) => {
  const homedir = Model.getHomeDirs();
  return res.status(OK).json({ homedir });
};

export const getDirs = async (req: Request, res: Response) => {
  let { path } = req.query;
  if (!path) {
    path = Model.getHomeDirs();
  }

  const dirs = await Model.getDirs(path);
  if (typeof dirs === "string") {
    return res.status(NOT_FOUND).json({ error: dirs });
  }
  return res.status(OK).json({ dirs });
};
