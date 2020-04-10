import { BaseProvider, DarkTheme, LightTheme, useStyletron } from "baseui";
import React, { useState } from "react";

import DirectoryPicker from "./components/DirectoryPicker";
import Header from "./components/Header";
import { useCallback } from "react";

interface AppProps {
  toggleTheme: () => void;
}

const heights = {
  header: "52px",
};

const App = ({ toggleTheme }: AppProps): JSX.Element => {
  const [css, theme] = useStyletron();

  return (
    <div className={css({ backgroundColor: theme.colors.background })}>
      <Header height={heights.header} toggleTheme={toggleTheme} />
      <DirectoryPicker height={`calc(100vh - ${heights.header})`} />
    </div>
  );
};

const AppWrapper = (): JSX.Element => {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = useCallback(() => {
    setIsDark(!isDark);
  }, [isDark]);

  return (
    <BaseProvider theme={isDark ? DarkTheme : LightTheme}>
      <App toggleTheme={toggleTheme} />
    </BaseProvider>
  );
};

export default AppWrapper;
