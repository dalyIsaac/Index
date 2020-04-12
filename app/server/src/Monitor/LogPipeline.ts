import { ComputerData, ForegroundItem, LogItem } from "./log";

import os from "os";

export default class LogPipeline {
  private previous: ForegroundItem | null = null;
  public readonly computerData: ComputerData;

  constructor() {
    this.computerData = {
      computerName: os.hostname(),
      osType: os.type(),
      osRelease: os.release(),
      osPlatform: os.platform(),
    };
  }

  private static keysToCheck: Array<keyof ForegroundItem> = [
    "ExecutableName",
    "ProcessName",
    "WindowTitle",
  ];

  private log = (previous: ForegroundItem, next: ForegroundItem): void => {
    // Construct the `LogItem`
    const logItem: LogItem = {
      ...this.computerData,
      startTimeStamp: previous.TimeStamp,
      endTimeStamp: next.TimeStamp,
      executableName: previous.ExecutableName,
      processName: previous.ProcessName,
      windowTitle: previous.WindowTitle,
    };

    console.log(logItem);
  };

  public push = (item: ForegroundItem): void => {
    if (this.previous !== null) {
      this.log(this.previous, item);
    }
    this.previous = item;
  };
}
