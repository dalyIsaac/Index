import React, { useCallback, useEffect, useRef } from "react";
import { SelectedPath, addRoot, setOS, setPath, toggle } from "./reducers";
import { useDispatch, useSelector } from "react-redux";

import FileSystem from "../FileSystem";
import { State } from "../../store";
import api from "@index/api";
import styles from "./DirectoryPicker.module.css";
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
      // Gets the current set directory or the home directory, operating
      // system, and file system separator.
      api.settings.directory.GET().then(async (dir) => {
        api.dirs.home.GET().then(async ({ os, separator: sep }) => {
          dispatch(setOS(os));
          dispatch(setPath(dir, sep));

          const pieces = dir.split(sep);
          dispatch(addRoot(pieces[0] || sep));

          getChildrenAndParents(dir, sep);
        });
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

  const onClick = useCallback(
    (path: string) => {
      // The slice is in order to distinguish between keyboard entry, which uses
      // the final separator to expand. However, a mouse selection doesn't mean
      // expansion.
      const newPath = path.slice(0, path.length - 1);
      dispatch(setPath(newPath));
    },
    [dispatch],
  );

  const onSelect = useCallback(() => {
    api.settings.POST({ directory: state.path });
  }, [state.path]);

  return (
    <div>
      <div className={styles.pathWrapper}>
        <input type="text" value={state.path} onChange={onChangeText} />
        <button className={styles.selectButton} onClick={onSelect}>
          Select
        </button>
      </div>
      <SelectedPath.Provider value={state.path}>
        <FileSystem
          {...state.fileSystem}
          onToggle={onToggle}
          onClick={onClick}
          onGetChildren={getChildrenAndParents}
        />
      </SelectedPath.Provider>
    </div>
  );
};

export default DirectoryPicker;
