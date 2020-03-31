import React, { useCallback, useEffect, useReducer } from "react";
import {
  SelectedPath,
  addRoot,
  getInitialState,
  reducer,
  setError,
  setOS,
  setPath,
  toggle,
  updateFileSystem,
} from "./state";

import FileSystem from "../FileSystem";
import api from "@index/api/dirs";
import { getParent } from "./directory";

const DirectoryPicker = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, getInitialState());

  useEffect(() => {
    if (!state.fileSystem.separator) {
      api.home.GET().then(async ({ homedir, os, separator: sep }) => {
        dispatch(setOS(os));
        dispatch(setPath(homedir, sep));

        const pieces = getParent(homedir, sep).split(sep);
        let currentPath = pieces[0];

        if (pieces[0] === "") {
          currentPath = "";
        }
        dispatch(addRoot(pieces[0] || sep));

        for (let p of pieces) {
          currentPath += p + sep;
          const dirs = await api.GET(currentPath);
          dispatch(updateFileSystem(currentPath, dirs));
        }
      });
    }
  }, [state.fileSystem.separator]);

  useEffect(() => {
    if (state.path && state.differentParent) {
      let parent = getParent(state.path, state.fileSystem.separator);
      if (parent[parent.length - 1] !== state.fileSystem.separator) {
        parent += state.fileSystem.separator;
      }

      const parentNode = state.fileSystem.items[parent];

      if (parentNode && parentNode.children === undefined) {
        api
          .GET(state.path)
          .then((dirs) => {
            dispatch(updateFileSystem(parent, dirs));
            dispatch(toggle(parent));
          })
          .catch((err) => {
            setError(err);
          });
      }
    }
  }, [
    state.differentParent,
    state.path,
    state.fileSystem.separator,
    state.fileSystem.items,
  ]);

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
      dispatch(updateFileSystem(parentPath, dirs));
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
