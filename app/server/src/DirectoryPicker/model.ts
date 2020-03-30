import { Dirent, promises } from "fs";

import { Home } from "@index/api/dirs/home";
import { homedir } from "os";
import path from "path";

export const getHomeDirs = (): Home => {
  return { homedir: homedir(), os: process.platform, separator: path.sep };
};

const getParents = (completePath: string): string => {
  const pieces = completePath.split(path.sep);
  pieces.pop();
  const result = pieces.join(path.sep);
  return result;
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
  let currentPath = path;
  const errors = [];

  for (let i = 0; i < 2; i++) {
    try {
      if (i !== 0) {
        console.log("Trying the next level up.");
      } else if (
        currentPath.length === 2 &&
        currentPath[currentPath.length - 1] === ":"
      ) {
        return { dirs: [] }; // This doesn't handle different drives in Windows
      }
      const files = await promises.readdir(currentPath, {
        withFileTypes: true,
      });
      return { dirs: processDirs(files) };
    } catch (err) {
      errors.push(`No such directory ${currentPath}`);
      console.error(err);
      currentPath = getParents(currentPath);
    }
  }

  return { errors };
};
