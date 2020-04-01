import React, { useCallback, useEffect, useRef } from "react";
import { SelectedPath, addRoot, setOS, setPath, toggle } from "./state";
import { useDispatch, useSelector } from "react-redux";

import FileSystem from "../FileSystem";
import { State } from "../../store";
import api from "@index/api/dirs";
import useGetChildrenAndParents from "./useGetChildrenAndParents";
import useOnUpdatedPath from "./useOnUpdatedPath";

const DirectoryPicker = (): JSX.Element => {
  const state = useSelector((state: State) => state.directoryPicker);
  const dispatch = useDispatch();

  const getChildrenAndParents = useGetChildrenAndParents();
  const onUpdatedPath = useOnUpdatedPath();

  const alreadyRun = useRef(false);
  useEffect(() => {
    // Only needs to run at the very start.
    if (!alreadyRun.current) {
      // Gets the home directory, operating system, and file system separator.
      api.home.GET().then(async ({ homedir, os, separator: sep }) => {
        dispatch(setOS(os));
        dispatch(setPath(homedir, sep));

        const pieces = homedir.split(sep);
        dispatch(addRoot(pieces[0] || sep));

        getChildrenAndParents(homedir, sep);
      });
      alreadyRun.current = true;
    }
  }, [dispatch, getChildrenAndParents, state.fileSystem.separator]);

  useEffect(() => {
    onUpdatedPath();
  }, [onUpdatedPath]);

  useEffect(() => {}, []);

  const onChangeText = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setPath(e.target.value));
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
