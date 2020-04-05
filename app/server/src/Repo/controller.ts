import * as Model from "./model";

import { Request, Response } from "express";

import { OK } from "http-status-codes";

export const openRepo = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  await Model.openRepo();
  return res.status(OK).json({});
};
