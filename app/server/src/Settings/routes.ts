import { getSettings, postSettings } from "./controller";

import { Application } from "express";
import settings from "@index/api/settings";

const settingsRoutes = (app: Application): void => {
  app.route(settings.API).get(getSettings).post(postSettings);
};

export default settingsRoutes;
