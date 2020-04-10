import { API_SETTINGS } from "./_root";
import { get } from "../fetch";

export const API_SETTINGS_THEME = API_SETTINGS + "/theme";

const theme = {
  API: API_SETTINGS_THEME,
  GET: () => get<string>(API_SETTINGS_THEME),
};

export default theme;
