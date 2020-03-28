import ExpressServer from "./server";
import dotenv from "dotenv";

const startServer = () => {
  dotenv.config();

  const server = new ExpressServer(process.env.NODE_ENV);
  server.start(parseInt(process.env.PORT || "3001"));
};

// Start the server or run tests
if (process.argv[2] !== "test") {
  let server = new ExpressServer();
  startServer();
}
