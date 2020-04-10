import { BrowserRouter, Route } from "react-router-dom";
import Header, { HEADER_HEIGHT } from "./components/Header";
import Starting, { StartingRoute } from "./pages/Starting";

import React from "react";
import RepoDirectory from "./pages/OOBE/RepoDirectory";
import { SetupRoutes } from "./pages/OOBE";
import Welcome from "./pages/OOBE/Welcome";
import { useStyletron } from "baseui";

export interface RouterProps {
  toggleTheme: () => void;
}

const Router = ({ toggleTheme }: RouterProps): JSX.Element => {
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

export default Router;
