import WebSocket, { Data, Server } from "ws";

import LogPipeline from "./LogPipeline";
import api from "@index/api";
import http from "http";
import { parseMonitor } from "./log";

export default class Monitor {
  private readonly server: Server;
  private socket: WebSocket | undefined;
  private readonly logPipeline: LogPipeline;

  constructor(server: http.Server, repoPath: string) {
    this.logPipeline = new LogPipeline(repoPath);
    this.server = new Server({
      server,
      clientTracking: true,
      path: api.monitor.API,
    });
    this.server.on("connection", this.onConnection);
    this.server.on("close", this.onClose);
  }

  private onConnection = (
    socket: WebSocket,
    request: http.IncomingMessage,
    head: Buffer,
  ): void => {
    this.socket = socket;
    this.socket.on("message", this.onMessage);
  };

  private onMessage = (data: WebSocket.Data): void => {
    if (typeof data !== "string") {
      console.error(`Received data which is not a string: ${data}`);
      return;
    }

    const foregroundItem = parseMonitor(data);
    this.logPipeline.push(foregroundItem);
  };

  private onClose = () => {
    console.log("Server closed");
  };

  public close = () => {
    this.socket?.close();
  };
}
