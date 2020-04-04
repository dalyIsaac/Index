import "xterm/css/xterm.css";

import React, { useCallback, useEffect, useRef } from "react";
import { TERMINAL_ENDPOINT, TERMINAL_SOCKET } from "@index/api/socket";

import { AttachAddon } from "xterm-addon-attach";
import { FitAddon } from "xterm-addon-fit";
import { Terminal } from "xterm";

// import WebSocket from "ws"

const IndexTerm = (): JSX.Element => {
  const termDiv = useRef<HTMLDivElement>(null);
  const term = useRef(new Terminal());
  const fitAddon = useRef(new FitAddon());

  const socket = useRef(new WebSocket(TERMINAL_SOCKET));

  const onSocketOpen = useCallback(() => {
    term.current.loadAddon(new AttachAddon(socket.current));
  }, []);

  socket.current.onopen = onSocketOpen;
  socket.current.onerror = (e) => {
    throw e;
  };

  const sendSizeToServer = useCallback(() => {
    let cols = term.current.cols.toString();
    let rows = term.current.rows.toString();

    while (cols.length < 3) {
      cols = "0" + cols;
    }

    while (rows.length < 3) {
      rows = "0" + rows;
    }

    socket.current.send(`ESCAPED|-- RESIZE:${cols};${rows}`);
  }, []);

  const fit = useCallback(() => {
    fitAddon.current.fit();
    setTimeout(() => {
      sendSizeToServer();
    }, 500);
  }, [sendSizeToServer]);

  const resize = useCallback(
    (cols, rows) => {
      term.current.resize(cols, rows);
      sendSizeToServer();
    },
    [sendSizeToServer],
  );

  useEffect(() => {
    if (termDiv.current && socket.current) {
      term.current.open(termDiv.current);
      term.current.loadAddon(fitAddon.current);
      term.current.write("Loading...!");
      fit();
    }
  }, [fit]);

  return <div ref={termDiv} />;
};

export default IndexTerm;
