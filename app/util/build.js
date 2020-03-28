const os = require("os");
const { spawn } = require("child_process");

const command =
  os.type() === "Windows_NT"
    ? ["powershell.exe", ["util/build-windows.ps1"]]
    : "./util/build-nix.sh";

const build = spawn(...command);

build.stdout.on("data", data => {
  console.log(`${data}`);
});

build.stderr.on("data", data => {
  console.error(`${data}`);
});

build.on("error", error => {
  console.error(`${error.message}`);
});

build.on("close", code => {
  console.log(`Child process exited with code ${code}`);
});
