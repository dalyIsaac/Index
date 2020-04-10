import { H1, Paragraph1 } from "baseui/typography";

import React from "react";
import { useStyletron } from "baseui";

export interface SettingsPageProps {
  title: string;
  description: string;
  children: JSX.Element | JSX.Element[];
}

const SettingsPage = ({
  title,
  description,
  children,
}: SettingsPageProps): JSX.Element => {
  const [css, theme] = useStyletron();

  const wrapper = css({
    display: "grid",
    gridTemplateColumns: "75% 25%",
  });
  const descriptionWrapper = css({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: "20px",
  });

  return (
    <div className={wrapper}>
      <div>{children}</div>
      <div className={descriptionWrapper}>
        <H1>{title}</H1>
        <Paragraph1>{description}</Paragraph1>
      </div>
    </div>
  );
};

export default SettingsPage;
