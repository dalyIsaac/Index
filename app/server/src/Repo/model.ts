import { Repository } from "nodegit";
import { addReadme } from "./template";
import { getDirectory } from "../Settings/settings";
import path from "path";

export const openRepo = async () => {
  const pathStr = await getDirectory();
  const repoPath = path.resolve(pathStr);
  try {
    // Try open the repo
    const repo = await Repository.open(repoPath);
    console.log("HERE");
  } catch (error) {
    // Initialze the repo
    await addReadme(repoPath);
    const repo = await Repository.init(repoPath, 0);
  }
};
