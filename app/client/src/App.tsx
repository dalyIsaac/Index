import {
  BaseProvider,
  DarkTheme,
  LightTheme,
  styled,
  useStyletron,
} from "baseui";
import { BrowserRouter, Route } from "react-router-dom";
import Header, { HEADER_HEIGHT } from "./components/Header";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Starting, { StartingRoute } from "./pages/Starting";

import RepoDirectory from "./pages/OOBE/RepoDirectory";
import { SetupRoutes } from "./pages/OOBE";
import Welcome from "./pages/OOBE/Welcome";
import WhiteToBlack from "./components/WhiteToBlack";
import settings from "@index/api/settings";

interface AppProps {
  toggleTheme: () => void;
}

const Routes = ({ toggleTheme }: AppProps): JSX.Element => {
  const [css, theme] = useStyletron();
  const appWrapper = css({
    height: `calc(100vh - ${HEADER_HEIGHT})`,
  });

  return (
    <div className={css({ backgroundColor: theme.colors.background })}>
      <Header height={HEADER_HEIGHT} toggleTheme={toggleTheme} />
      <div className={appWrapper}>
        <BrowserRouter>
          <Route path={SetupRoutes.repo}>
            <RepoDirectory />
          </Route>
          <Route path={SetupRoutes.welcome}>
            <Welcome />
          </Route>
          <Route path={StartingRoute}>
            <Starting />
          </Route>
        </BrowserRouter>
      </div>
    </div>
  );
};

const App = (): JSX.Element => {
  const [isDark, setIsDark] = useState(false);
  const [hasFetchedTheme, setHasFetchedTheme] = useState(false);
  const [doneThemeTransition, setDoneThemeTransition] = useState(false);

  useEffect(() => {
    settings.theme.GET().then((theme) => {
      setIsDark(theme === "dark");
      setHasFetchedTheme(true);
    });
  }, []);

  const toggleTheme = useCallback(() => {
    settings.POST({ theme: isDark ? "light" : "dark" });
    setIsDark(!isDark);
  }, [isDark]);

  const child = useMemo(() => {
    if (doneThemeTransition || (hasFetchedTheme && !isDark)) {
      return <Routes toggleTheme={toggleTheme} />;
    } else if (hasFetchedTheme && isDark) {
      return <WhiteToBlack onComplete={setDoneThemeTransition} />;
    }
    return null;
  }, [doneThemeTransition, hasFetchedTheme, isDark, toggleTheme]);

  return (
    <BaseProvider theme={isDark ? DarkTheme : LightTheme}>{child}</BaseProvider>
  );
};

export default App;
