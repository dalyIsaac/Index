import {
  IFileSystem,
  getParent,
  populate,
  updateFileSystem,
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

export const updateChildren = createAction(
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

export const reducer = createReducer(getInitialState(), {
  [setPath.type]: (state, action) => {
    const { path, separator } = action.payload;

    if (separator) {
      state.fileSystem.separator = separator;
    }

    const prevParent = getParent(state.path, state.fileSystem.separator);
    const newParent = getParent(path, state.fileSystem.separator);
    state.differentParent = newParent !== prevParent;

    state.path = path;
  },
  [setError.type]: (state, { payload }) => {
    state.error = payload;
  },
  [setOS.type]: (state, { payload }) => {
    state.os = payload;
  },
  [updateChildren.type]: (state, { payload }) => {
    const { parent, dirs } = payload;
    updateFileSystem(
      state.fileSystem,
      parent,
      dirs,
      state.fileSystem.separator,
    );
  },
  [setInitialFileSystem.type]: (state, { payload }) => {
    populate(state.fileSystem, payload, state.fileSystem.separator);
  },
  [toggle.type]: (state, { payload }) => {
    const item = state.fileSystem.items[payload];
    item.isExpanded = !item.isExpanded;
  },
});
