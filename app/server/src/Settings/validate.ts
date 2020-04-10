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
  value: T | undefined,
  { type, required, validate }: SchemaItem<T>,
  allowPartial = false,
): Promise<string | undefined> => {
  key = capitalizeFirstLetter(key);

  if (required === true && value === undefined && allowPartial === false) {
    return `"${key}" is required. Please add it to settings.`;
  }

  if (value === undefined) {
    return;
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
    if (typeof validateResult === "string" || validateResult === false) {
      return `"${key}" is not valid. ${validateResult}`;
    }
  }

  return;
};

export const validateData = async (
  data: Partial<Settings>,
  allowPartial = false,
): Promise<SettingsResult> => {
  // eslint-disable-next-line
  // @ts-ignore
  const results: SettingsResult = {};

  let key: SettingsKey;
  for (key in SettingsSchema) {
    if (Object.prototype.hasOwnProperty.call(SettingsSchema, key)) {
      const schemaItem = SettingsSchema[key];
      const value = data[key] || SettingsSchema[key].default;

      if (
        value === undefined &&
        (schemaItem.required === false || allowPartial)
      ) {
        continue;
      }
      const error = await validateItem(key, value, schemaItem, allowPartial);

      results[key] = {
        value,
        error,
      };
    }
  }
  return results;
};
