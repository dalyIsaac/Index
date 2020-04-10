import { Button, KIND } from "baseui/button";

import LightBulb from "./LightBulb";
import React from "react";
import { StatefulTooltip } from "baseui/tooltip";
import { useStyletron } from "baseui";

interface HeaderProps {
  height: string;
  toggleTheme: () => void;
}

const Header = ({ height, toggleTheme }: HeaderProps): JSX.Element => {
  const [css, theme] = useStyletron();
  const headerWrapper = css({
    height,
    display: "flex",
    justifyContent: "space-between",
    alignContent: "center",
  });
  const indexLink = css({
    ...theme.typography.HeadingMedium,
    lineHeight: height,
    paddingLeft: "8px",
    paddingRight: "8px",
  });
  const heroLink = css({
    color: theme.colors.primary,
    textDecoration: "none",
    ":hover": {
      color: theme.colors.contentSecondary,
      backgroundColor: theme.colors.backgroundTertiary,
    },
  });

  return (
    <div className={headerWrapper}>
      <a className={heroLink} href="/">
        <span className={indexLink}>index</span>
      </a>
      <StatefulTooltip content="Toggle theme" accessibilityType="tooltip">
        <Button kind={KIND.minimal} onClick={toggleTheme}>
          <LightBulb isDark={theme.name !== "light-theme"} />
        </Button>
      </StatefulTooltip>
    </div>
  );
};

export default Header;
