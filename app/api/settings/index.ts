export * from "./schema";

import { API_SETTINGS } from "./_root";
import { get } from "../fetch";

export interface Settings {
  directory?: string;
}

const settings = {
  API: API_SETTINGS,
  GET: () => get<Settings>(API_SETTINGS),
};

export default settings;
