import { API_DIRS } from "./_root";
import { get } from "../fetch";
import { default as homeImport } from "./home";
export const home = homeImport;

const dirs = {
  API: API_DIRS,
  GET: (path: string) => get<string[]>(API_DIRS, { path }),
  home,
};

export default dirs;
