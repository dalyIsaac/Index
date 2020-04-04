import { IPty, spawn } from "node-pty";
import { TERMINAL_ENDPOINT, TERMINAL_PORT } from "@index/api/socket";
import WebSocket, { Data, Server } from "ws";

import http from "http";

export default class Terminal {
  private tty: IPty;
  private server: Server;
  private socket: WebSocket | undefined;

  constructor() {
    const shell = process.platform === "win32" ? "powershell.exe" : "bash";
    this.tty = spawn(shell, [], {
      name: "xterm-color",
      cols: 80,
      rows: 24,
      cwd: process.env.PWD,
      env: process.env as { [key: string]: string },
    });
    this.tty.on("exit", this.ttyExit);

    this.server = new Server({
      port: TERMINAL_PORT,
      clientTracking: true,
      path: TERMINAL_ENDPOINT,
    });
    this.server.on("connection", this.onConnection);
    this.server.on("close", this.onClose);
  }

  private ttyExit = (exitCode: number, signal?: number) => {
    console.log(
      `Exited with code ${exitCode}` + signal !== undefined
        ? ` and signal ${signal}`
        : "",
    );
  };

  private onConnection = (
    socket: WebSocket,
    request: http.IncomingMessage,
    head: Buffer,
  ): void => {
    this.socket = socket;
    this.socket.on("message", this.onMessage);
    this.tty.on("data", this.onData);
  };

  private onMessage = (data: WebSocket.Data): void => {
    console.log(data);
    this.socket?.send("HELLO WORLD");
    // if (typeof data === "string" && data.startsWith("ESCAPED|-- RESIZE:")) {
    //   const msg = data.substr(18);
    //   const cols = Number(msg.slice(0, -4));
    //   const rows = Number(msg.substr(4));
    //   this.tty.resize(cols, rows);
    //   this.onResized(cols, rows);
    // } else {
    //   this.tty.write(data.toString());
    // }
  };

  private onResized = (cols: number, rows: number) => {
    console.log(`Resized terminal to ${cols}*${rows}`);
  };

  private onData = (data: string) => {
    try {
      this.socket?.send(data);
    } catch (error) {
      console.error(error);
    }
  };

  private onClose = () => {
    console.log("Server closed");
  };
}
