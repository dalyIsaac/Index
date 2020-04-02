export * from "./schema";

import { SettingsResult, SettingsSchema } from "./schema";
import { get, post } from "../fetch";

import { API_SETTINGS } from "./_root";

const settings = {
  API: API_SETTINGS,
  GET: () => get<SettingsResult>(API_SETTINGS),
  POST: (json: Partial<SettingsSchema>) =>
    post<Partial<SettingsSchema>, Partial<SettingsResult>>(
      API_SETTINGS,
      undefined,
      json,
    ),
};

export default settings;
