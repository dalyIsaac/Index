import { homedir } from "os";
import { promises } from "fs";

export const getHomeDirs = (): string => {
  return homedir();
};

export const getDirs = async (path: string): Promise<string | string[]> => {
  try {
    const files = await promises.readdir(path, { withFileTypes: true });

    const dirs = [];
    for (const dirent of files) {
      if (dirent.isDirectory()) {
        dirs.push(dirent.name);
      }
    }
    return dirs;
  } catch (error) {
    console.error(error);
    return `No such directory ${path}`;
  }
};
