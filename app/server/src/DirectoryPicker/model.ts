import { Home } from "@index/api/dirs/home";
import { homedir } from "os";
import path from "path";
import { promises } from "fs";

export const getHomeDirs = (): Home => {
  return { homedir: homedir(), os: process.platform, separator: path.sep };
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
