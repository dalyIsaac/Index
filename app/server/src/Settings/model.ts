import { Settings, SettingsResult } from "@index/api/settings/schema";
import { readSettings, settingsPath } from "./settings";

import { homedir } from "os";
import { promises } from "fs";
import { validateData } from "./validate";

export const getSettings = async (): Promise<SettingsResult> => {
  const data = await readSettings();
  const results = validateData(data);
  return results;
};

export const postSettings = async (
  data: Partial<Settings>,
): Promise<Partial<SettingsResult>> => {
  const result = await validateData(data, true);
  const errors: Partial<SettingsResult> = {};
  const settings = await readSettings();

  let key: keyof SettingsResult;
  for (key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      const { value, error } = result[key];
      if (!error) {
        settings[key] = value;
      } else {
        errors[key] = { value, error };
      }
    }
  }

  await promises.writeFile(settingsPath, JSON.stringify(settings));

  return errors;
};

export const getDirectory = async (): Promise<string> => {
  const settings = await getSettings();
  const { value } = settings["directory"];

  // For initial startup
  if (!value) {
    return homedir();
  }
  return value;
};
