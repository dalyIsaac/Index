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

};

export const addReadme = async (repoPath: string): Promise<void> => {
  // TODO: Add proper README
  const readme = addSeparator(repoPath, path.sep) + "README.md";
  await promises.writeFile(readme, "Hello Index!");
};
