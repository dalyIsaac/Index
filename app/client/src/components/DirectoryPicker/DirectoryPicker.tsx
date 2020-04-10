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
import { SettingsPageChildProps } from "../SettingsPage/SettingsPage";
import { State } from "../../store";
import { addSeparator } from "@index/helpers";
import api from "@index/api";
import useGetChildrenAndParents from "./useGetChildrenAndParents";
import useOnUpdatedPath from "./useOnUpdatedPath";
import { useState } from "react";
import { useStyletron } from "baseui";

export interface DirectoryPickerProps extends SettingsPageChildProps {
  height: string;
}

const DirectoryPicker = ({
  height,
  setCanProceed,
  setMessage,
}: DirectoryPickerProps): JSX.Element => {
  const state = useSelector((state: State) => state.directoryPicker);
  const dispatch = useDispatch();
  const alreadyRun = useRef(false);

  const [canSave, setCanSave] = useState(false);
  const updatePath = useCallback(
    (dir: string, sep = state.fileSystem.separator, hasRun = true) => {
      dispatch(setPath(dir, sep));
      if (hasRun && addSeparator(dir, sep) !== addSeparator(state.path, sep)) {
        console.log(hasRun);
        setCanProceed?.(false);
        setMessage?.("Please save your changes");
        setCanSave(true);
      }
    },
    [
      dispatch,
      setCanProceed,
      setMessage,
      state.fileSystem.separator,
      state.path,
    ],
  );

  const getChildrenAndParents = useGetChildrenAndParents();
  const onUpdatedPath = useOnUpdatedPath();

  useEffect(() => {
    // Only needs to run at the very start.
    if (!alreadyRun.current) {
      // Gets the current set directory or the home directory, operating
      // system, and file system separator.
      api.settings.directory.GET().then(async (dir) => {
        api.dirs.home.GET().then(async ({ os, separator: sep }) => {
          dispatch(setOS(os));
          updatePath(dir, sep, false);
          setCanProceed?.(true);

          const pieces = dir.split(sep);
          dispatch(addRoot(pieces[0] || sep));

          getChildrenAndParents(dir, sep);
        });
      });

      alreadyRun.current = true;
    }
  }, [
    dispatch,
    getChildrenAndParents,
    setCanProceed,
    state.fileSystem.separator,
    updatePath,
  ]);

  useEffect(() => {
    onUpdatedPath();
  }, [onUpdatedPath]);

  useEffect(() => {}, []);

  const onChangeText = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updatePath(e.target.value);
    },
    [updatePath],
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
      updatePath(newPath); // TODO: Alter setPath
    },
    [updatePath],
  );

  const onSave = useCallback(() => {
    api.settings.POST({ directory: state.path });
    setCanProceed?.(true);
    setMessage?.("");
    setCanSave(false);
  }, [setCanProceed, setMessage, state.path]);

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
          disabled={!canSave}
          onClick={onSave}
          kind={ButtonKind.primary}
          size={ButtonSize.default}
          shape={ButtonShape.pill}
        >
          {canSave ? "Save" : "Saved"}
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
