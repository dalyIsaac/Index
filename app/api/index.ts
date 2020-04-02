import { default as dirsImport } from "./dirs";
import { default as settingsImport } from "./settings";

export const settings = settingsImport;
export const dirs = dirsImport;

const api = {
  dirs,
  settings,
};

export default api;
