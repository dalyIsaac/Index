import { Display4 } from "baseui/typography";
import React from "react";
import { SetupRoutes } from "../OOBE";
import { Spinner } from "baseui/spinner";
import api from "@index/api";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useStyletron } from "baseui";

const Starting = (): JSX.Element => {
  const history = useHistory();

  useEffect(() => {
    api.settings.directory.GET().then((result) => {
      if (result) {
        history.push("/");
      } else {
        history.push(SetupRoutes.welcome);
      }
    });
  }, [history]);

  const [css, theme] = useStyletron();

  const welcomeStyle = css({
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  });

  return (
    <div className={welcomeStyle}>
      <Spinner />
      <Display4>Starting up...</Display4>
    </div>
  );
};

export default Starting;
