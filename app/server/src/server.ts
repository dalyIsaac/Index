import express, { Application } from "express";

import bodyParser from "body-parser";
import directoryPickerRoutes from "./DirectoryPicker/routes";
import dotenv from "dotenv";
import path from "path";
import repoRoutes from "./Repo/routes";
import settingsRoutes from "./Settings/routes";

dotenv.config();
const PORT = process.env.PORT || 3001;

const serveFrontEndProd = (app: Application) => {
  const dir = path.join(__dirname, "public/index/");
  // Set the static and views directory
  app.set("views", dir);
  app.use(express.static(dir));
  // Serve front-end content
  app.get("*", (req, res) => {
    res.sendFile("index.html", { root: dir });
  });
};

const DEV_MSG =
  "Express Server is running in development mode. " +
  "No front-end content is being served.";

const serveUI = (app: Application) => {
  if (process.env.NODE_ENV !== "production") {
    app.get("*", (req, res) => res.send(DEV_MSG));
  } else {
    serveFrontEndProd(app);
  }
};

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
directoryPickerRoutes(app);
settingsRoutes(app);
repoRoutes(app);

// Run
serveUI(app);
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
