import { Button, KIND, SHAPE, SIZE } from "baseui/button";
import { ChevronDown, ChevronRight } from "baseui/icon";
import { IDirectoryItem, IFileSystem } from "../DirectoryPicker/state";
import React, { useCallback, useContext, useMemo } from "react";

import { SelectedPath } from "../DirectoryPicker/reducers";
import { Separator } from "./state";
import { useStyletron } from "baseui";

export interface FileSystemProps {
  items: IFileSystem["items"];
  node: IDirectoryItem;
  onToggle: (id: string) => void;
  onClick: (path: string) => void;
  onGetChildren: (path: string) => void;
}

const FileSystemItem = ({
  items,
  node,
  onToggle,
  onGetChildren,
  onClick,
}: FileSystemProps): JSX.Element => {
  const selectedPath = useContext(SelectedPath);
  const separator = useContext(Separator);

  const children = useMemo(() => {
    const renderedChildren = [];

    if (node.isExpanded && node.children) {
      for (const key of node.children) {
        const dir = items[key];
        renderedChildren.push(
          <div key={dir.path} style={{ paddingLeft: 28 }}>
            <FileSystemItem
              key={dir.path}
              node={dir}
              items={items}
              onToggle={onToggle}
              onGetChildren={onGetChildren}
              onClick={onClick}
            />
          </div>,
        );
      }
    }

    return renderedChildren;
  }, [items, node.children, node.isExpanded, onGetChildren, onClick, onToggle]);

  const toggle = useCallback(() => {
    onToggle(node.path);
    if (node.isExpanded === false && node.children === undefined) {
      onGetChildren(node.path);
    }
  }, [node.children, node.path, node.isExpanded, onGetChildren, onToggle]);

  const select = useCallback(() => {
    onClick(node.path);
  }, [node.path, onClick]);

  const isSelected = useMemo(() => {
    const pathNoSep =
      node.path[node.path.length - 1] === separator
        ? node.path.substr(0, node.path.length - 1)
        : node.path;
    return selectedPath === pathNoSep || selectedPath === node.path;
  }, [node.path, selectedPath, separator]);

  const [css, theme] = useStyletron();
  const itemWrapper = css({ paddingTop: "1px", paddingBottom: "1px" });
  const wrapper = css({
    padding: "4px",
    borderRadius: theme.borders.radius400,
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    ":hover": {
      backgroundColor: theme.colors.contentInverseSecondary,
      cursor: "pointer",
    },
    ":active": {
      backgroundColor: theme.colors.contentInverseTertiary,
      cursor: "pointer",
    },
  });
  const wrapperSelected = css({
    backgroundColor: theme.colors.contentInverseSecondary,
  });
  const label = css({
    color: theme.colors.colorPrimary,
    paddingLeft: "16px",
    ":hover": {
      cursor: "pointer",
    },
  });

  return (
    <div className={itemWrapper}>
      <div
        className={`${wrapper} ${!isSelected || wrapperSelected}`}
        onClick={select}
      >
        <Button
          onClick={toggle}
          size={SIZE.mini}
          shape={SHAPE.round}
          kind={KIND.primary}
        >
          {node.isExpanded ? <ChevronDown /> : <ChevronRight />}
        </Button>
        <label className={label}>{node.label}</label>
      </div>
      {children}
    </div>
  );
};

export default FileSystemItem;
