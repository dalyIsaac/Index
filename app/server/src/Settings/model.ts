import { Settings, SettingsResult } from "@index/api/settings/schema";

import { addSeparator } from "@index/helpers";
import { homedir } from "os";
import path from "path";
import { promises } from "fs";
import { validateData } from "./validate";

export const getSettings = async (): Promise<SettingsResult> => {
  const fullPath = addSeparator(homedir(), path.sep) + ".index-settings.json";
  let data: Settings;

  try {
    const rawdata = await promises.readFile(fullPath);
    data = JSON.parse(rawdata.toString());
  } catch (err) {
    console.error(err);
    // Create the non-existent file
    await promises.writeFile(fullPath, JSON.stringify({ directory: "" }));
    data = { directory: "" };
  }

  const results = validateData(data);

  return results;
};
