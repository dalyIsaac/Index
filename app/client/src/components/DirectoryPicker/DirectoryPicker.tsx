import React, { useCallback, useEffect, useRef } from "react";
import {
  SelectedPath,
  addRoot,
  setError,
  setIsExpanded,
  setOS,
  setPath,
  toggle,
  updateFileSystem,
} from "./state";
import { addSeparator, getParent } from "./directory";
import { useDispatch, useSelector } from "react-redux";

import FileSystem from "../FileSystem";
import { State } from "../../store";
import api from "@index/api/dirs";

const DirectoryPicker = (): JSX.Element => {
  const state = useSelector((state: State) => state.directoryPicker);
  const dispatch = useDispatch();

  const getChildrenAndParents = useCallback(
    async (path: string, separator?: string) => {
      const fs = state.fileSystem;

      // For when the separator hasn't propagated through the state.
      let sep = separator;
      if (!sep) {
        ({ separator: sep } = state.fileSystem);
      }

      // Each piece is a level up of the path.
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

        // Only gets if the path doesn't exist, or the children array doesn't
        // exist.
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
    [dispatch, state.fileSystem],
  );

  useEffect(() => {
    // Only needs to run at the very start.
    if (!state.fileSystem.separator) {
      // Gets the home directory, operating system, and file system separator.
      api.home.GET().then(async ({ homedir, os, separator: sep }) => {
        dispatch(setOS(os));
        dispatch(setPath(homedir, sep));

        const pieces = homedir.split(sep);
        dispatch(addRoot(pieces[0] || sep));

        getChildrenAndParents(homedir, sep);
      });
    }
  }, [dispatch, getChildrenAndParents, state.fileSystem.separator]);

  // Used in the next useEffect.
  const previousNewPath = useRef("");

  useEffect(() => {
    // Runs for each update to the path.
    const newPath = addSeparator(state.path, state.fileSystem.separator);
    // Prevents unnecessary requests, as useEffect will be triggered by various
    // updates to the state, which aren't path updates.
    if (newPath !== previousNewPath.current) {
      previousNewPath.current = newPath;

      const node = state.fileSystem.items[newPath];
      // Expands if input from keyboard, as mouse input doesn't have a separator
      // at the end.
      if (node && newPath === state.path) {
        dispatch(setIsExpanded(newPath));
      }

      if (node && node.children === undefined) {
        getChildrenAndParents(newPath);
      } else if (!node) {
        const parent = getParent(newPath, state.fileSystem.separator);
        const parentNode = state.fileSystem.items[parent];

        if (parentNode && !parentNode.isExpanded) {
          dispatch(setIsExpanded(parent, true));
          if (!parentNode.children) {
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
    dispatch,
  ]);

  useEffect(() => {}, []);

  const onChangeText = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setPath(e.currentTarget.value));
    },
    [dispatch],
  );

  const onToggle = useCallback(
    (id: string) => {
      dispatch(toggle(id));
    },
    [dispatch],
  );

  const onSelect = useCallback(
    (path: string) => {
      // The slice is in order to distinguish between keyboard entry, which uses
      // the final separator to expand. However, a mouse selection doesn't mean
      // expansion.
      const newPath = path.slice(0, path.length - 1);
      dispatch(setPath(newPath));
    },
    [dispatch],
  );

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
