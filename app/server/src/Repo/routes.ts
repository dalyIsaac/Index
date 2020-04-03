import { Application } from "express";
import { openRepo } from "./controller";
import repo from "@index/api/repo";

const repoRoutes = (app: Application): void => {
  app.route(repo.open.API).get(openRepo);
};

export default repoRoutes;
