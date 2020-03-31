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
import { getParent } from "./directory";

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
      let parent = getParent(state.path, state.fileSystem.separator);
      if (parent[parent.length - 1] !== state.fileSystem.separator) {
        parent += state.fileSystem.separator;
      }

      const parentNode = state.fileSystem.items[parent];

      if (parentNode && parentNode.children === undefined) {
        api
          .GET(state.path)
          .then((dirs) => {
            dispatch(updateChildren(parent, dirs));
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
