const { homedir } = require("os");
const os = require("os");

export interface IHomeDirectory {
  homeDir: string;
}

export const getHomeDirectory = (): IHomeDirectory => {
  return { homeDir: homedir() };
};
