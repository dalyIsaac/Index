import { default as dirsImport } from "./dirs";
import { default as monitorImport } from "./monitor";
import { default as settingsImport } from "./settings";

export const settings = settingsImport;
export const dirs = dirsImport;
export const monitor = monitorImport;

const api = {
  dirs,
  settings,
  monitor,
};

export default api;
