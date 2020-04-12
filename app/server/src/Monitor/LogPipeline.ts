import { ComputerData, ForegroundItem, LogItem } from "./log";

import { getFolders } from "../Repo/template";
import os from "os";

export default class LogPipeline {
  private previous: ForegroundItem | null = null;
  public readonly computerData: ComputerData;
  public repoPath: string;

  constructor(repoPath: string) {
    this.repoPath = repoPath;

    this.computerData = {
      computerName: os.hostname(),
      osType: os.type(),
      osRelease: os.release(),
      osPlatform: os.platform(),
    };
  }

  private write = (item: LogItem): void => {
    if (!this.repoPath) {
      throw Error("The repoPath has not been set for the LogPipeline.");
    }

    const date = new Date(item.startTimeStamp);
    const { yearFolder, monthFolder, dayFile } = getFolders(
      this.repoPath,
      date,
    );

    console.log({ yearFolder, monthFolder, dayFile });
  };

  private log = (previous: ForegroundItem, next: ForegroundItem): void => {
    // Construct the `LogItem`
    const item: LogItem = {
      ...this.computerData,
      startTimeStamp: previous.TimeStamp,
      endTimeStamp: next.TimeStamp,
      executableName: previous.ExecutableName,
      processName: previous.ProcessName,
      windowTitle: previous.WindowTitle,
    };
    this.write(item);
  };

  public push = (item: ForegroundItem): void => {
    if (this.previous !== null) {
      this.log(this.previous, item);
    }
    this.previous = item;
  };
}
