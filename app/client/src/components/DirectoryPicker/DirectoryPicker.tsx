import React, { useCallback, useEffect, useReducer, useRef } from "react";
import {
  SelectedPath,
  addRoot,
  getInitialState,
  reducer,
  setError,
  setIsExpanded,
  setOS,
  setPath,
  toggle,
  updateFileSystem,
} from "./state";
import { addSeparator, getParent } from "./directory";

import FileSystem from "../FileSystem";
import api from "@index/api/dirs";

const DirectoryPicker = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, getInitialState());

  const getChildrenAndParents = useCallback(
    async (path: string, separator?: string) => {
      const fs = state.fileSystem;

      let sep = separator;
      if (!sep) {
        ({ separator: sep } = state.fileSystem);
      }

      const pieces = path.split(sep);
      let currentPath = pieces[0];

      if (pieces[0] === "") {
        currentPath = "";
      }
      if (pieces[pieces.length - 1] === "") {
        pieces.pop();
      }

      let parent = "";
      for (let p of pieces) {
        currentPath += p;
        currentPath = addSeparator(currentPath, sep);
        const currentNode = fs.items[currentPath];
        if (!currentNode || !currentNode.children) {
          try {
            const dirs = await api.GET(currentPath);
            dispatch(updateFileSystem(currentPath, dirs));
            if (parent) {
              dispatch(setIsExpanded(currentPath));
            }
            parent = currentPath;
          } catch (error) {
            dispatch(setError(error));
          }
        }
      }
    },
    [state.fileSystem],
  );

  useEffect(() => {
    // Only needs to run at the very start
    if (!state.fileSystem.separator) {
      // Gets the home directory, operating system, and file system separator
      api.home.GET().then(async ({ homedir, os, separator: sep }) => {
        dispatch(setOS(os));
        dispatch(setPath(homedir, sep));

        const pieces = homedir.split(sep);
        dispatch(addRoot(pieces[0] || sep));

        getChildrenAndParents(homedir, sep);
      });
    }
  }, [getChildrenAndParents, state.fileSystem.separator]);

  // Used in the next useEffect
  const previousNewPath = useRef("");

  useEffect(() => {
    const newPath = addSeparator(state.path, state.fileSystem.separator);
    if (newPath !== previousNewPath.current) {
      previousNewPath.current = newPath;

      const node = state.fileSystem.items[newPath];
      if (node && node.children === undefined && newPath === state.path) {
        getChildrenAndParents(newPath);
      } else if (!node) {
        const parent = getParent(newPath, state.fileSystem.separator);
        const parentNode = state.fileSystem.items[parent];
        if (parentNode) {
          dispatch(setIsExpanded(parent, true));
          if (!parentNode.children) {
            console.log({ parent, newPath });
            getChildrenAndParents(newPath);
          }
        }
      }
    }
  }, [
    state.differentParent,
    state.path,
    state.fileSystem.separator,
    state.fileSystem.items,
    getChildrenAndParents,
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

  return (
    <div>
      <input type="text" value={state.path} onChange={onChangeText} />
      <SelectedPath.Provider value={state.path}>
        <FileSystem
          {...state.fileSystem}
          onToggle={onToggle}
          onSelect={onSelect}
          onGetChildren={getChildrenAndParents}
        />
      </SelectedPath.Provider>
    </div>
  );
};

export default DirectoryPicker;
