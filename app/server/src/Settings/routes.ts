import { Application } from "express";
import { getSettings } from "./controller";
import settings from "@index/api/settings";

const settingsRoutes = (app: Application): void => {
  app.route(settings.API).get(getSettings);
};

export default settingsRoutes;
