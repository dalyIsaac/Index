import {
  IFileSystem,
  getParent,
  populate,
  updateFileSystem,
} from "./directory";
import { createAction, createReducer } from "@reduxjs/toolkit";

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
  separator: "",
  differentParent: true, // used for a search box to get the contents of parents
  fileSystem: { roots: [], items: {} } as IFileSystem,
});

export const reducer = createReducer(getInitialState(), {
  [setPath.type]: (state, action) => {
    const { path, separator } = action.payload;

    if (separator) {
      state.separator = separator;
    }

    const prevParent = getParent(state.path, state.separator);
    const newParent = getParent(path, state.separator);
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
    updateFileSystem(state.fileSystem, parent, dirs, state.separator);
  },
  [setInitialFileSystem.type]: (state, { payload }) => {
    populate(state.fileSystem, payload, state.separator);
  },
  [toggle.type]: (state, { payload }) => {
    const item = state.fileSystem.items[payload];
    item.isExpanded = !item.isExpanded;
  },
});
