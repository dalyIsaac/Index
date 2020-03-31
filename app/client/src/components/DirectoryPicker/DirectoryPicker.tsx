import React, { useCallback, useEffect, useReducer } from "react";
import {
  SelectedPath,
  getInitialState,
  reducer,
  setError,
  setInitialFileSystem,
  setOS,
  setPath,
  toggle,
  updateChildren,
} from "./state";

import FileSystem from "../FileSystem";
import api from "@index/api/dirs";

const DirectoryPicker = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, getInitialState());

  useEffect(() => {
    api.home.GET().then(({ homedir, os, separator }) => {
      dispatch(setOS(os));
      dispatch(setPath(homedir, separator));
      dispatch(setInitialFileSystem(homedir));
    });
  }, [state.fileSystem.separator]);

  useEffect(() => {
    if (state.path && state.differentParent) {
      api
        .GET(state.path)
        .then((result) => {
          if (Array.isArray(result)) {
            // dispatch(setDirs(result));
          }
        })
        .catch((err) => {
          setError(err);
        });
    }
  }, [state.differentParent, state.path, state.fileSystem.separator]);

  useEffect(() => {}, []);

  const onChangeText = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPath(e.currentTarget.value));
  }, []);

  const onToggle = useCallback((id: string) => {
    dispatch(toggle(id));
  }, []);

  const onSelect = useCallback((path: string) => {
    dispatch(setPath(path));
  }, []);

  const getChildren = useCallback(async (parentPath: string) => {
    try {
      const dirs = await api.GET(parentPath);
      dispatch(updateChildren(parentPath, dirs));
    } catch (error) {
      console.error(error);
      dispatch(setError(error));
    }
  }, []);

  return (
    <div>
      <input type="text" value={state.path} onChange={onChangeText} />
      <SelectedPath.Provider value={state.path}>
        <FileSystem
          {...state.fileSystem}
          onToggle={onToggle}
          onSelect={onSelect}
          onGetChildren={getChildren}
        />
      </SelectedPath.Provider>
    </div>
  );
};

export default DirectoryPicker;
