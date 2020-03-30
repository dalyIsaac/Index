import { API_DIRS } from "./_root";
import { get } from "../fetch";

export interface Home {
  homedir: string;
  os: string;
  separator: string;
}

export const API_DIRS_HOME = API_DIRS + "/home";

const home = {
  API: API_DIRS_HOME,
  GET: () => get<Home>(API_DIRS_HOME),
};

export default home;
