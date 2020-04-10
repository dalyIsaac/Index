import { BaseProvider, DarkTheme, LightTheme, useStyletron } from "baseui";
import { BrowserRouter, Route } from "react-router-dom";
import Header, { HEADER_HEIGHT } from "./components/Header";
import React, { useCallback, useEffect, useState } from "react";
import Starting, { StartingRoute } from "./pages/Starting";

import { CSSTransition } from "react-transition-group";
import RepoDirectory from "./pages/OOBE/RepoDirectory";
import { SetupRoutes } from "./pages/OOBE";
import Welcome from "./pages/OOBE/Welcome";
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

const transitionDuration = 1000;

const App = (): JSX.Element => {
  const [isDark, setIsDark] = useState(false);
  const [renderDark, setRenderDark] = useState(false);

  useEffect(() => {
    settings.theme.GET().then((theme) => {
      setIsDark(theme === "dark");
      setRenderDark(true);
    });
  }, []);

  const toggleTheme = useCallback(() => {
    settings.POST({ theme: isDark ? "light" : "dark" });
    setIsDark(!isDark);
  }, [isDark]);

  const [css] = useStyletron();

  const enter = css({
    opacity: 0,
  });

  const enterActive = css({
    opacity: "1",
    transition: `opacity ${transitionDuration}ms, transform ${transitionDuration}ms`,
    transitionTimingFunction: "linear",
  });

  return (
    <BaseProvider theme={isDark ? DarkTheme : LightTheme}>
      <CSSTransition
        in={renderDark}
        timeout={transitionDuration}
        classNames={{ enter, enterActive }}
        unmountOnExit
      >
        <Routes toggleTheme={toggleTheme} />
      </CSSTransition>
    </BaseProvider>
  );
};

export default App;
