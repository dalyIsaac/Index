import { Display1, Display2, Display4 } from "baseui/typography";
import React, { useCallback } from "react";

import { Button } from "baseui/button";
import { HEADER_HEIGHT } from "../../components/Header";
import { SetupRoutes } from ".";
import { useHistory } from "react-router-dom";
import { useStyletron } from "baseui";

const Welcome = (): JSX.Element => {
  const [css] = useStyletron();
  const history = useHistory();
  const onProceed = useCallback(() => {
    history.push(SetupRoutes.repo);
  }, [history]);

  const wrapperStyle = css({
    height: `calc(100vh - ${HEADER_HEIGHT})`,
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
  });
  const spacerStyle = css({ margin: "40px" });

  return (
    <div className={wrapperStyle}>
      <Display2>Welcome to</Display2>
      <Display1>index</Display1>
      <div className={spacerStyle} />
      <Display4>This is a work in progress</Display4>
      <div className={spacerStyle} />
      <div>
        <Button onClick={onProceed}>Proceed</Button>
      </div>
    </div>
  );
};

export default Welcome;
