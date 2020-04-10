import { BaseProvider, DarkTheme, LightTheme, useStyletron } from "baseui";
import { BrowserRouter, Route } from "react-router-dom";
import Header, { HEADER_HEIGHT } from "./components/Header";
import React, { useState } from "react";

import RepoDirectory from "./pages/OOBE/RepoDirectory";
import { SetupRoutes } from "./pages/OOBE";
import Welcome from "./pages/OOBE/Welcome";
import { useCallback } from "react";

interface AppProps {
  toggleTheme: () => void;
}

const Routes = ({ toggleTheme }: AppProps): JSX.Element => {
  const [css, theme] = useStyletron();

  return (
    <div className={css({ backgroundColor: theme.colors.background })}>
      <Header height={HEADER_HEIGHT} toggleTheme={toggleTheme} />
      <BrowserRouter>
        <Route path={SetupRoutes.repo}>
          <RepoDirectory />
        </Route>
        <Route path={SetupRoutes.welcome}>
          <Welcome />
        </Route>
      </BrowserRouter>
    </div>
  );
};

const App = (): JSX.Element => {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = useCallback(() => {
    setIsDark(!isDark);
  }, [isDark]);

  return (
    <BaseProvider theme={isDark ? DarkTheme : LightTheme}>
      <Routes toggleTheme={toggleTheme} />
    </BaseProvider>
  );
};

export default App;
