import { promises } from "fs";

export interface SchemaItem<T> {
  id: string;
  type:
    | "bigint"
    | "boolean"
    | "number"
    | "object"
    | "string"
    | "undefined"
    | any;
  example: () => T;
  validate?: (value: T) => Promise<boolean | string>;
  default?: any;
  required?: boolean;
}

export type SettingsSchema = {
  [id in "directory"]: SchemaItem<string>;
};

export const SettingsSchema: SettingsSchema = {
  directory: {
    id: "directory",
    type: "string",
    required: true,
    validate: async (s) => {
      try {
        await promises.access(s);
        return true;
      } catch (error) {
        return `The directory "${s}" doesn't exist or is invalid.`;
      }
    },
    example: () => "C:\\Users\\username\\Repos\\indextracker",
  },
};

export type SettingsKey = keyof typeof SettingsSchema;
export type Settings = {
  [key in SettingsKey]: ReturnType<typeof SettingsSchema[key]["example"]>;
};

export type SettingsResult = {
  [key in SettingsKey]: {
    error?: string;
    value: ReturnType<typeof SettingsSchema[key]["example"]>;
  };
};
