import { BaseProvider, DarkTheme, LightTheme, useStyletron } from "baseui";
import React, { useCallback, useEffect, useState } from "react";

import { CSSTransition } from "react-transition-group";
import Router from "./Router";
import settings from "@index/api/settings";

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
        <Router toggleTheme={toggleTheme} />
      </CSSTransition>
    </BaseProvider>
  );
};

export default App;
