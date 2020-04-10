import DirectoryPicker from "./components/DirectoryPicker";
import React from "react";
import { useStyletron } from "baseui";

function App() {
  const [css, theme] = useStyletron();

  return (
    <div className={css({ backgroundColor: theme.colors.background })}>
      <DirectoryPicker />
    </div>
  );
}

export default App;
