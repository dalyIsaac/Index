import WebSocket, { Data, Server } from "ws";

import api from "@index/api";
import http from "http";

export default class Monitor {
  private server: Server;
  private socket: WebSocket | undefined;

  constructor(server: http.Server) {
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
    console.log(data);
    this.socket?.send("HELLO WORLD");
  };

  private onClose = () => {
    console.log("Server closed");
  };
}
