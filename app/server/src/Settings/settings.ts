import { Settings, SettingsSchema } from "@index/api/settings/schema";

import { addSeparator } from "@index/helpers";
import { homedir } from "os";
import path from "path";
import { promises } from "fs";
import { validateData } from "./validate";

export const settingsPath =
  addSeparator(homedir(), path.sep) + ".index-settings.json";

export const readSettings = async (): Promise<Settings> => {
  let data: Settings;
  try {
    const rawdata = await promises.readFile(settingsPath);
    data = JSON.parse(rawdata.toString());
  } catch (err) {
    console.error(err);
    // Create the non-existent file
    await promises.writeFile(settingsPath, JSON.stringify({ directory: "" }));
    data = {
      directory: "",
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      theme: SettingsSchema.theme.default!,
    };
  }
  return data;
};

export const getDirectory = async (): Promise<string> => {
  const settings = await readSettings();
  const results = await validateData(settings, false);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return results.directory.value!; // theme has a default in the schema
};
