import { H1, Label2, Paragraph1 } from "baseui/typography";
import React, { useCallback, useState } from "react";

import { Button } from "baseui/button";
import { useHistory } from "react-router-dom";
import { useStyletron } from "baseui";

export interface SettingsPageChildProps {
  setCanProceed?: (canProceed: boolean) => void;
  setMessage?: (message: string) => void;
}

export interface SettingsPageProps<Props extends SettingsPageChildProps> {
  title: string;
  description: string;
  component: React.ComponentType<Props>;
  props: Props;
  nextUrl: string;
}

function SettingsPage<Props>({
  title,
  description,
  component: Component,
  props,
  nextUrl,
}: SettingsPageProps<Props>): JSX.Element {
  const history = useHistory();
  const onProceed = useCallback(() => {
    history.push(nextUrl);
  }, [history, nextUrl]);

  const [css, theme] = useStyletron();
  const [canProceed, setCanProceed] = useState(false);
  const [message, setMessage] = useState("");

  const wrapperStyle = css({
    display: "grid",
    gridTemplateColumns: "auto 400px",
  });
  const descriptionWrapperStyle = css({
    paddingLeft: "20px",
  });
  const descriptionContentStyle = css({
    gridRow: 2,
    paddingTop: "80%",
  });
  const spacerStyle = css({
    padding: "4px",
  });

  return (
    <div className={wrapperStyle}>
      <Component
        {...props}
        setCanProceed={setCanProceed}
        setMessage={setMessage}
      />
      <div className={descriptionWrapperStyle}>
        <div className={descriptionContentStyle}>
          <H1>{title}</H1>
          <div className={spacerStyle}></div>
          <Paragraph1>{description}</Paragraph1>
          <div className={spacerStyle}></div>
          <Button onClick={onProceed} disabled={!canProceed}>
            Proceed
          </Button>
          <div className={spacerStyle}></div>
          <Label2 color={theme.colors.contentNegative}>{message}</Label2>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
