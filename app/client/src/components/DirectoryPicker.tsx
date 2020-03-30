import React, { useCallback, useEffect, useReducer } from "react";
import { createAction, createReducer } from "@reduxjs/toolkit";

import api from "@index/api/dirs";

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

const getInitialState = () => ({
  path: "",
  dirs: [],
  error: "",
  os: "",
  separator: "",
  differentParent: true,
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
});

const DirectoryPicker = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, getInitialState());

  useEffect(() => {
    api.home.GET().then(({ homedir, os, separator }) => {
      console.log("useEffect");
      dispatch(setOS(os));
      dispatch(setPath(homedir, separator));
    });
  }, []);

  useEffect(() => {
    if (state.path && state.differentParent) {
      console.log("Getting more dirs");
      api
        .GET(state.path)
        .then((result) => {
          console.log(result);
          if (Array.isArray(result)) {
            dispatch(setDirs(result));
          }
        })
        .catch((err) => {
          setError(err);
        });
    }
  }, [state.differentParent, state.path]);

  const onChangeText = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("onChangeText");
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
