import os from "os";
import { spawn } from "child_process";

export interface TerminalCommand {
  changeDir?: string;
  command: string;
  onSuccess?: TerminalCommand;
  onError?: TerminalCommand;
}

const terminal = (rootCommand: TerminalCommand) => {
  return new Promise((resolve, reject) => {
    let currentCommand = rootCommand;
    const shell = os.platform() === "win32" ? "powershell.exe" : "bash";
    const process = spawn(shell);

    const write = (input: string): void => {
      process.stdin.write(input + os.EOL);
    };

    const executeCommand = () => {
      if (currentCommand?.changeDir) {
        write(`cd ${currentCommand.changeDir}`);
      }
      write(currentCommand.command);
    };

    const getDate = () => {
      return new Date().toString();
    };

    const log = (level: string, data: string): void => {
      console.log(
        `${getDate()}\n` +
          `[${level.toLowerCase()}] ${currentCommand.changeDir || ""}$ ${
            currentCommand?.command
          }\n` +
          `${data}` +
          `\n\n`,
      );
    };

    const onStdout = (data: string) => {
      log("STDOUT", data);
      if (currentCommand?.onSuccess) {
        currentCommand = currentCommand.onSuccess;
        executeCommand();
      } else {
        resolve();
      }
    };

    const onStderr = (data: string) => {
      log("STDERR", data);
      if (currentCommand?.onError) {
        currentCommand = currentCommand.onError;
        executeCommand();
      } else {
        reject(data);
      }
    };

    process.stdout.on("data", onStdout);
    process.stderr.on("data", onStderr);

    executeCommand();
  });
};

export default terminal;
