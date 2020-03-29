import { getDirs, getHomeDirs } from "./controller";
import type { Application } from "express";
import dirs from "@index/api/dirs";

const directoryPickerRoutes = (app: Application): void => {
  app.route(dirs.API).get(getDirs);
  app.route(dirs.home.API).get(getHomeDirs);
};

export default directoryPickerRoutes;
