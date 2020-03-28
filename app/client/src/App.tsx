import "./App.css";

import React, { useEffect } from "react";

import logo from "./logo.svg";

function App() {
  useEffect(() => {
    fetch("/api/dirs/home")
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
      .catch(err => console.error(err));

    fetch("/api/dirs")
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Hello World!
        </a>
      </header>
    </div>
  );
}

export default App;
