import { addSeparator } from "@index/helpers";
import path from "path";
import { promises } from "fs";

export interface LogTemplate {
  computer: {
    name: string;
    os: string;
  };
  datetime: {
    start: string;
    end: string;
  };
  executable: {
    name: string;
    path: string;
  };
  document?: {
    name: string;
    path: string;
  };
}

export const getFolders = (repoPath: string) => {
  repoPath = addSeparator(repoPath, path.sep);

  const now = new Date();
  const year = now.getUTCFullYear();
  const yearFolder = repoPath + year;

  const month = now.getUTCMonth();
  const monthFolder = addSeparator(yearFolder, path.sep) + month;

  const day = now.getUTCDate();
  const dayFile = addSeparator(monthFolder, path.sep) + day;

  return { now, yearFolder, monthFolder, dayFile };
};

export const addReadme = async (repoPath: string): Promise<void> => {
  // TODO: Add proper README
  const readme = addSeparator(repoPath, path.sep) + "README.md";
  await promises.writeFile(readme, "Hello Index!");
};
