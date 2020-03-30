import { getDirs, getHomeDirs } from "./controller";
import type { Application } from "express";
import dirs from "@index/api/dirs";

const directoryPickerRoutes = (app: Application): void => {
  app.route(dirs.home.API).get(getHomeDirs);
  app.route(dirs.API).get(getDirs);
};

export default directoryPickerRoutes;
