export * from "./schema";

import { Settings, SettingsResult } from "./schema";
import { get, post } from "../fetch";

import { API_SETTINGS } from "./_root";
import { default as directoryImport } from "./directory";

export const directory = directoryImport;

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
};

export default settings;
