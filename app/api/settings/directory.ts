import { API_SETTINGS } from "./_root";
import { get } from "../fetch";

export const API_SETTINGS_DIR = API_SETTINGS + "/dir";

const dir = {
  API: API_SETTINGS_DIR,
  GET: () => get<string>(API_SETTINGS_DIR),
};

export default dir;
