import fs from "fs";

export const checkExists = async (path: string): Promise<boolean> => {
  try {
    await fs.promises.access(path);
    return true;
  } catch (error) {
    return false;
  }
};
