import * as controllers from "./controllers";

import DemoController from "./controllers/DemoController";
import { Logger } from "@overnightjs/logger";
import { Server } from "@overnightjs/core";
import bodyParser from "body-parser";
import express from "express";
import path from "path";

class ExpressServer extends Server {
  private readonly NODE_ENV: string | undefined;
  private readonly SERVER_START_MSG = "Demo server started on port: ";
  private readonly DEV_MSG =
    "Express Server is running in development mode. " +
    "No front-end content is being served.";

  constructor(nodeEnv?: string) {
    super(true);
    this.NODE_ENV = nodeEnv;

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    super.addControllers(new DemoController());

    if (this.NODE_ENV !== "production") {
      this.app.get("*", (req, res) => res.send(this.DEV_MSG));
    } else {
      this.serveFrontEndProd();
    }
  }

  private setupControllers(): void {
    const ctlrInstances = [];
    for (const name in controllers) {
      if (controllers.hasOwnProperty(name)) {
        let Controller = (controllers as any)[name];
        ctlrInstances.push(new Controller());
      }
    }
    super.addControllers(ctlrInstances);
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      Logger.Imp(this.SERVER_START_MSG + port);
    });
  }

  private serveFrontEndProd(): void {
    const dir = path.join(__dirname, "public/index/");
    // Set the static and views directory
    this.app.set("views", dir);
    this.app.use(express.static(dir));
    // Serve front-end content
    this.app.get("*", (req, res) => {
      res.sendFile("index.html", { root: dir });
    });
  }
}

export default ExpressServer;
