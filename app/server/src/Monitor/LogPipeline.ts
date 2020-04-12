import { ComputerData, ForegroundItem, LogItem } from "./log";
import { checkExists, writeNewFile, writeToFile } from "@index/helpers";

import { getFolders } from "../Repo/template";
import os from "os";
import { promises } from "fs";

interface TodayData {
  date: Date | null;
  logItems: LogItem[];
  yearFolder: string;
  monthFolder: string;
  dayFile: string;
}

export default class LogPipeline {
  private previous: ForegroundItem | null = null;
  public readonly computerData: ComputerData;
  public repoPath: string;
  private data: TodayData = {
    date: null,
    logItems: [],
    yearFolder: "",
    monthFolder: "",
    dayFile: "",
  };

  constructor(repoPath: string) {
    this.repoPath = repoPath;

    this.computerData = {
      computerName: os.hostname(),
      osType: os.type(),
      osRelease: os.release(),
      osPlatform: os.platform(),
    };
  }

  private differentDates = (startDate: Date): boolean => {
    return (
      this.data.date?.getUTCFullYear() !== startDate.getUTCFullYear() ||
      this.data.date?.getUTCMonth() !== startDate.getUTCMonth() ||
      this.data.date?.getUTCDate() !== startDate.getUTCDate()
    );
  };

  private loadData = async (startDate: Date): Promise<void> => {
    const { yearFolder, monthFolder, dayFile } = getFolders(
      this.repoPath,
      startDate,
    );

    // Updates the local copy
    this.data.yearFolder = yearFolder;
    this.data.monthFolder = monthFolder;
    this.data.dayFile = dayFile;

    // Creates the folders and files if they don't exist
    if ((await checkExists(yearFolder)) === false) {
      await promises.mkdir(yearFolder);
    }
    if ((await checkExists(monthFolder)) === false) {
      await promises.mkdir(monthFolder);
    }
    if ((await checkExists(dayFile)) === false) {
      await writeNewFile(dayFile, "[]");
    }

    // Gets the data and updates the local copy
    const rawdata = await promises.readFile(this.data.dayFile);
    this.data.logItems = JSON.parse(rawdata.toString());
  };

  private write = async (item: LogItem): Promise<void> => {
    if (!this.repoPath) {
      throw Error("The repoPath has not been set for the LogPipeline.");
    }

    const startDate = new Date(item.startTimeStamp);

    if (this.differentDates(startDate)) {
      await this.loadData(startDate);
    }

    this.data.logItems.push(item);
    writeToFile(this.data.dayFile, JSON.stringify(this.data.logItems, null, 2));
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
