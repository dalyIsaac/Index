import { addSeparator } from "@index/helpers";
import path from "path";
import { promises } from "fs";

export const populateFromTemplate = async (repoPath: string): Promise<void> => {
  // TODO: Check if year exists
  // TODO: Check if month exists
  // TODO: Check if day exists
  // TODO: Populate day with template
};

export const addReadme = async (repoPath: string): Promise<void> => {
  // TODO: Add proper README
  const readme = addSeparator(repoPath, path.sep) + "README.md";
  await promises.writeFile(readme, "Hello Index!");
};
