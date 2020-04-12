import Server from "./Server";

const PORT = parseInt(process.env.PORT || "3001");
const server = new Server(PORT);
server.start();
server.startMonitoring();

process.on("SIGINT", () => {
  server.onShutdown();
});
