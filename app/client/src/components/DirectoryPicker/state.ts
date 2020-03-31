import {
  addRootHandler,
  setErrorHandler,
  setOSHandler,
  setPathHandler,
  toggleHandler,
  updateFileSystemHandler,
} from "./handlers";
import { createAction, createReducer } from "@reduxjs/toolkit";

import { IFileSystem } from "./directory";
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

export const addRoot = createAction("addRoot", (path: string) => ({
  payload: path,
}));

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
  [addRoot.type]: addRootHandler,
  [setError.type]: setErrorHandler,
  [setOS.type]: setOSHandler,
  [setPath.type]: setPathHandler,
  [toggle.type]: toggleHandler,
  [updateFileSystem.type]: updateFileSystemHandler,
});
