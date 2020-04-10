import {
  getDirectory,
  getSettings,
  getTheme,
  postSettings,
} from "./controller";

import { Application } from "express";
import settings from "@index/api/settings";

const settingsRoutes = (app: Application): void => {
  app.route(settings.API).get(getSettings).post(postSettings);
  app.route(settings.directory.API).get(getDirectory);
  app.route(settings.theme.API).get(getTheme);
};

export default settingsRoutes;
