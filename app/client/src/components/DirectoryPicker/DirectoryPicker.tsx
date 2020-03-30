import { FileSystem, populate } from "./directory";
import React, { useCallback, useEffect, useReducer } from "react";
import { createAction, createReducer } from "@reduxjs/toolkit";

import api from "@index/api/dirs";

// import populate from "./populate";

const getParent = (path: string, separator: string): string => {
  const pieces = path.split(separator);
  if (pieces.length === 0) {
    return "";
  }

  pieces.pop();
  return pieces.join(separator);
};

const setPath = createAction("path", (path: string, separator?: string) => ({
  payload: { path, separator },
}));
const setError = createAction("error", (error: string | string[]) => ({
  payload: error,
}));
const setOS = createAction("OS", (os: string) => ({ payload: os }));
const setDirs = createAction("dirs", (dirs: string[]) => ({ payload: dirs }));
const updateFileSystem = createAction("contents", (dirs: string[]) => ({
  payload: dirs,
}));
const setInitialFileSystem = createAction(
  "initialContents",
  (homedir: string) => ({ payload: homedir }),
);

const getInitialState = () => ({
  path: "",
  dirs: [],
  error: "",
  os: "",
  separator: "",
  differentParent: true,
  fileSystem: { roots: [], items: {} } as FileSystem,
});

const reducer = createReducer(getInitialState(), {
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
  [setDirs.type]: (state, { payload }) => {
    state.dirs = payload;
  },
  [updateFileSystem.type]: (state, { payload }) => {
    // TODO
  },
  [setInitialFileSystem.type]: (state, { payload }) => {
    populate(state.fileSystem, payload, state.separator);
  },
});

const DirectoryPicker = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, getInitialState());

  useEffect(() => {
    api.home.GET().then(({ homedir, os, separator }) => {
      dispatch(setOS(os));
      dispatch(setPath(homedir, separator));
      dispatch(setInitialFileSystem(homedir));
    });
  }, [state.separator]);

  useEffect(() => {
    if (state.path && state.differentParent) {
      api
        .GET(state.path)
        .then((result) => {
          if (Array.isArray(result)) {
            dispatch(setDirs(result));
          }
        })
        .catch((err) => {
          setError(err);
        });
    }
  }, [state.differentParent, state.path, state.separator]);

  const onChangeText = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPath(e.currentTarget.value));
  }, []);

  return (
    <div>
      <input type="text" value={state.path} onChange={onChangeText} />
      {state.dirs}
    </div>
  );
};

export default DirectoryPicker;
