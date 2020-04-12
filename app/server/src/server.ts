import express, { Application } from "express";
import http, { createServer } from "http";

import Monitor from "./Monitor";
import bodyParser from "body-parser";
import directoryPickerRoutes from "./DirectoryPicker/routes";
import dotenv from "dotenv";
import { getDirectory } from "./Settings/model";
import path from "path";
import repoRoutes from "./Repo/routes";
import settingsRoutes from "./Settings/routes";

export default class Server {
  private static DEV_MSG =
    "Express Server is running in development mode. " +
    "No front-end content is being served.";

  private httpServer: http.Server | null = null;
  public app: Application;
  public port: number;
  public monitor: Monitor | null = null;

  constructor(port: number) {
    dotenv.config();
    this.port = port;

    this.app = express();

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    directoryPickerRoutes(this.app);
    settingsRoutes(this.app);
    repoRoutes(this.app);
  }

  private serveFrontEndProd = () => {
    const dir = path.join(__dirname, "public/index/");
    // Set the static and views directory
    this.app.set("views", dir);
    this.app.use(express.static(dir));
    // Serve front-end content
    this.app.get("*", (req, res) => {
      res.sendFile("index.html", { root: dir });
    });
  };

  private serveUI = () => {
    if (process.env.NODE_ENV !== "production") {
      this.app.get("*", (req, res) => res.send(Server.DEV_MSG));
    } else {
      this.serveFrontEndProd();
    }
  };

  public start = (): void => {
    this.httpServer = createServer();
    this.serveUI();
    this.httpServer.listen(this.port, () => {
      console.log(`Server is listening on port ${this.port}`);
    });
  };

  public onShutdown = () => {
    console.log("Shutting down...");
    this.stopMonitoring();
    if (this.httpServer) {
      this.httpServer.close();
    }
  };

  public startMonitoring = async () => {
    if (this.httpServer === null) {
      this.start();
    }

    const repoPath = await getDirectory();
    // this.httpServer is initialized in `start`.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.monitor = new Monitor(this.httpServer!, repoPath);
    console.log(`Server's monitor WebSocket is listening on port ${this.port}`);
  };

  public stopMonitoring = () => {
    if (this.monitor) {
      this.monitor.close();
    }
  };
}
