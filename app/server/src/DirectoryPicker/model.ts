import { Dirent, promises } from "fs";

import { Home } from "@index/api/dirs/home";
import { homedir } from "os";
import path from "path";

export const getHomeDirs = (): Home => {
  return { homedir: homedir(), os: process.platform, separator: path.sep };
};

const processDirs = (files: Dirent[]): string[] => {
  const dirs = [];
  for (const dirent of files) {
    if (dirent.isDirectory()) {
      dirs.push(dirent.name);
    }
  }
  return dirs;
};

export const getDirs = async (
  path: string,
): Promise<{ dirs?: string[]; errors?: string[] }> => {
  try {
    if (path.length === 2 && path[path.length - 1] === ":") {
      return { dirs: [] }; // TODO: This doesn't handle different drives in Windows
    }
    const files = await promises.readdir(path, {
      withFileTypes: true,
    });
    return { dirs: processDirs(files) };
  } catch (err) {
    console.error(err);
    return { errors: [`${err}`] };
  }
};
