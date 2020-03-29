import { API_ROOT } from "../index";
import { get } from "../fetch";
import { default as homeImport } from "./home";
export const home = homeImport;

export const API_DIRS = API_ROOT + "/dirs";

const dirs = {
  API: API_DIRS,
  GET: (path: string) => get<string[]>(API_DIRS, { path }),
  home,
};

export default dirs;
