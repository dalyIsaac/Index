import React, { useEffect } from "react";

import DirectoryPicker from "./components/DirectoryPicker";

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
    <div>
      Hello world!
      <DirectoryPicker />
    </div>
  );
}

export default App;
