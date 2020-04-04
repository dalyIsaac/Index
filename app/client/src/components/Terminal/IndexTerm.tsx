import "xterm/css/xterm.css";

import React, { useEffect, useRef } from "react";

import { Terminal } from "xterm";

const IndexTerm = (): JSX.Element => {
  const termDiv = useRef<HTMLDivElement>(null);
  const term = useRef(new Terminal());

  useEffect(() => {
    if (termDiv.current) {
      term.current.open(termDiv.current);
      term.current.write("Hello, world!");
    }
  }, []);

  return <div ref={termDiv} />;
};

export default IndexTerm;
