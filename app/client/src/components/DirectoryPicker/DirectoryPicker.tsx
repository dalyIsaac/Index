import {
  Button,
  KIND as ButtonKind,
  SHAPE as ButtonShape,
  SIZE as ButtonSize,
} from "baseui/button";
import React, { useCallback, useEffect, useRef } from "react";
import { SelectedPath, addRoot, setOS, setPath, toggle } from "./reducers";
import { useDispatch, useSelector } from "react-redux";

import FileSystem from "../FileSystem";
import { Input } from "baseui/input";
import { State } from "../../store";
import api from "@index/api";
import useGetChildrenAndParents from "./useGetChildrenAndParents";
import useOnUpdatedPath from "./useOnUpdatedPath";
import { useStyletron } from "baseui";

export interface DirectoryPickerProps {
  height: string;
}

const DirectoryPicker = ({ height }: DirectoryPickerProps): JSX.Element => {
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

  const onSave = useCallback(() => {
    api.settings.POST({ directory: state.path });
  }, [state.path]);

  const [css] = useStyletron();
  const wrapper = css({ maxHeight: "100vh" });
  const pathWrapper = css({
    display: "grid",
    gridTemplateColumns: "1fr 4px auto",
    paddingRight: "4px",
  });
  const fileSystem = css({
    height: `calc(${height} - 48px)`,
    overflowY: "auto",
  });

  return (
    <div className={wrapper}>
      <div className={pathWrapper}>
        <Input value={state.path} onChange={onChangeText} />
        <div />
        <Button
          onClick={onSave}
          kind={ButtonKind.primary}
          size={ButtonSize.default}
          shape={ButtonShape.pill}
        >
          Save
        </Button>
      </div>
      <div className={fileSystem}>
        <SelectedPath.Provider value={state.path}>
          <FileSystem
            {...state.fileSystem}
            onToggle={onToggle}
            onClick={onClick}
            onGetChildren={getChildrenAndParents}
          />
        </SelectedPath.Provider>
      </div>
    </div>
  );
};

export default DirectoryPicker;
