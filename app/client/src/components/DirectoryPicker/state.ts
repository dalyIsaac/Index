import {
  IFileSystem,
  setErrorHandler,
  setInitialFileSystemHandler,
  setOSHandler,
  setPathHandler,
  toggleHandler,
  updateFileSystemHandler,
} from "./directory";
import { createAction, createReducer } from "@reduxjs/toolkit";

import React from "react";

export const SelectedPath = React.createContext("");

export const setPath = createAction(
  "path",
  (path: string, separator?: string) => ({
    payload: { path, separator },
  }),
);

export const setError = createAction("error", (error: string | string[]) => ({
  payload: error,
}));

export const setOS = createAction("OS", (os: string) => ({ payload: os }));

export const updateFileSystem = createAction(
  "children",
  (parent: string, dirs: string[]) => ({
    payload: { parent, dirs },
  }),
);

export const setInitialFileSystem = createAction(
  "initialContents",
  (homedir: string) => ({ payload: homedir }),
);

export const toggle = createAction("toggle", (id: string) => ({ payload: id }));

export const getInitialState = () => ({
  path: "",
  error: "",
  os: "",
  differentParent: true, // used for a search box to get the contents of parents
  fileSystem: { roots: [], items: {}, separator: "" } as IFileSystem,
});

export type State = ReturnType<typeof getInitialState>;

export const reducer = createReducer(getInitialState(), {
  [setPath.type]: setPathHandler,
  [setError.type]: setErrorHandler,
  [setOS.type]: setOSHandler,
  [updateFileSystem.type]: updateFileSystemHandler,
  [setInitialFileSystem.type]: setInitialFileSystemHandler,
  [toggle.type]: toggleHandler,
});
