import { getDirs, getHomeDirs } from "./controller";
import type { Application } from "express";

const directoryPickerRoutes = (app: Application): void => {
  app.route("/api/dirs").get(getDirs);
  app.route("/api/dirs/home").get(getHomeDirs);
};

export default directoryPickerRoutes;
