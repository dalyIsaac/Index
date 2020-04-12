export interface ComputerData {
  osType: string;
  osRelease: string;
  osPlatform: string;
  computerName: string;
}

export interface LogItem extends ComputerData {
  startTimeStamp: string;
  endTimeStamp: string;
  executableName: string;
  processName: string;
  windowTitle: string;
}

/**
 * Based on the `ForegroundItem` C# class in the monitor.
 */
export interface ForegroundItem {
  ExecutableName: string;
  ProcessName: string;
  WindowTitle: string;
  TimeStamp: string;
}

export const parseMonitor = (item: string): ForegroundItem => {
  const json: ForegroundItem = JSON.parse(item);
  return json;
};
