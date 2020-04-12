import { addReadme } from "./template";
import { getDirectory } from "../Settings/settings";
import terminal from "../Terminal";

export const openRepo = async () => {
  const path = await getDirectory();
  await terminal({
    // Check if the directory is a repo
    changeDir: path,
    command: "git status",
    onError: {
      // Initialize the repo
      command: "git init",
    },
  });
  addReadme(path);
};
