export * from "./schema";

import { Settings, SettingsResult } from "./schema";
import { get, post } from "../fetch";

import { API_SETTINGS } from "./_root";
import { default as directoryImport } from "./directory";
import { default as themeImport } from "./theme";

export const directory = directoryImport;
export const theme = themeImport;

const settings = {
  API: API_SETTINGS,
  GET: () => get<SettingsResult>(API_SETTINGS),
  POST: (json: Partial<Settings>) =>
    post<Partial<Settings>, Partial<SettingsResult>>(
      API_SETTINGS,
      undefined,
      json,
    ),
  directory,
  theme,
};

export default settings;
