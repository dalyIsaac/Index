import * as Model from "./model";

import { Request, Response } from "express";

import { OK } from "http-status-codes";

export function getHomeDirectory(req: Request, res: Response) {
  console.log(req.query);
  const home = Model.getHomeDirectory();
  return res.status(OK).json(home);
}
