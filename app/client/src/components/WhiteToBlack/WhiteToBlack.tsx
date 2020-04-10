import React, { useEffect } from "react";

import { styled } from "baseui";

const white = "#FFFFFF";
const black = "#141414";

const Transition = styled("div", {
  animationDuration: "1s",
  animationIterationCount: 1,
  background: black,
  // @ts-ignore
  animationName: {
    from: {
      background: white,
    },
    to: {
      background: black,
    },
  },
  height: "100vh",
  width: "100vw",
});

interface WhiteToBlackProps {
  onComplete: (finished: boolean) => void;
}

const WhiteToBlack = ({ onComplete }: WhiteToBlackProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return <Transition />;
};

export default WhiteToBlack;
