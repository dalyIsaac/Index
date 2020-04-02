import {
  SchemaItem,
  Settings,
  SettingsKey,
  SettingsResult,
  SettingsSchema,
} from "@index/api/settings/schema";

const capitalizeFirstLetter = (s: string): string => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const validateItem = async <T>(
  key: string,
  value: T,
  { type, required, validate }: SchemaItem<T>,
): Promise<string | undefined> => {
  key = capitalizeFirstLetter(key);
  const validRequired = (required === true && !!value) || required === false;
  if (!validRequired) {
    return `"${key}" is required. Please add it to settings.`;
  }

  const validType = typeof value === type;
  if (!validType) {
    return (
      `"${key}" should be of type ${type}. ` +
      `"${key}" is currently of type ${typeof value}.`
    );
  }

  if (validate) {
    const validateResult = await validate(value);
    console.log(validateResult);
    if (typeof validateResult === "string" || validateResult === false) {
      return `"${key}" is not valid. ${validateResult}`;
    }
  }

  return;
};

export const validateData = async (data: Settings): Promise<SettingsResult> => {
  // eslint-disable-next-line
  // @ts-ignore
  const results: SettingsResult = {};

  let key: SettingsKey;
  for (key in SettingsSchema) {
    // eslint-disable-next-line no-prototype-builtins
    if (SettingsSchema.hasOwnProperty(key)) {
      const schemaItem = SettingsSchema[key];
      const value = data[key] || SettingsSchema[key].default;

      const error = await validateItem(key, value, schemaItem);

      results[key] = {
        value,
        error,
      };
    }
  }
  console.log(results);
  return results;
};
