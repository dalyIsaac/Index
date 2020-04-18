import App from "./components/App";
import React from "react";
import ReactDOM from "react-dom";

console.log(
  '👋 This message is being logged by "renderer.tsx", included via webpack',
);

ReactDOM.render(<App />, document.getElementById("root"));
