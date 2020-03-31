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
import { addSeparator } from "./directory";
import api from "@index/api/dirs";

const DirectoryPicker = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, getInitialState());

  useEffect(() => {
    // Only needs to run at the very start
    if (!state.fileSystem.separator) {
      // Gets the home directory, operating system, and file system separator
      api.home.GET().then(async ({ homedir, os, separator: sep }) => {
        dispatch(setOS(os));
        dispatch(setPath(homedir, sep));

        const pieces = homedir.split(sep);
        let currentPath = pieces[0];

        // Populates the parent directories of home, and their children
        if (pieces[0] === "") {
          currentPath = "";
        }
        dispatch(addRoot(pieces[0] || sep));

        let parent = "";
        for (let p of pieces) {
          currentPath += p + sep;
          const dirs = await api.GET(currentPath);
          dispatch(updateFileSystem(currentPath, dirs));
          if (parent) {
            dispatch(toggle(currentPath));
          }
          parent = currentPath;
        }
      });
    }
  }, [state.fileSystem.separator]);

  useEffect(() => {
    const newPath = addSeparator(state.path, state.fileSystem.separator);
    const node = state.fileSystem.items[newPath];

    if (node && node.children === undefined) {
      api
        .GET(newPath)
        .then((dirs) => {
          dispatch(updateFileSystem(newPath, dirs));
          // Toggles for text input
          if (state.path === newPath) {
            dispatch(toggle(newPath));
          }
        })
        .catch((err) => {
          console.log(err);
          setError(err);
        });
    } else if (state.path === newPath && node && !node.isExpanded) {
      // Toggles for text input
      dispatch(toggle(newPath));
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
