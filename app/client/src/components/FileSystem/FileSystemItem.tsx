import { IDirectoryItem, IFileSystem } from "../DirectoryPicker/directory";
import React, { useCallback, useContext, useMemo } from "react";

import { SelectedPath } from "../DirectoryPicker/state";
import { Separator } from "./state";
import styles from "./FileSystemItem.module.css";

export interface FileSystemProps {
  items: IFileSystem["items"];
  node: IDirectoryItem;
  onToggle: (id: string) => void;
  onSelect: (path: string) => void;
  onGetChildren: (path: string) => void;
}

const FileSystemItem = ({
  items,
  node,
  onToggle,
  onGetChildren,
  onSelect,
}: FileSystemProps): JSX.Element => {
  const selectedPath = useContext(SelectedPath);
  const separator = useContext(Separator);

  const children = useMemo(() => {
    const renderedChildren = [];

    if (node.isExpanded && node.children) {
      for (const key of node.children) {
        const dir = items[key];
        renderedChildren.push(
          <div key={dir.path} style={{ paddingLeft: 40 }}>
            <FileSystemItem
              key={dir.path}
              node={dir}
              items={items}
              onToggle={onToggle}
              onGetChildren={onGetChildren}
              onSelect={onSelect}
            />
          </div>,
        );
      }
    }

    return renderedChildren;
  }, [
    items,
    node.children,
    node.isExpanded,
    onGetChildren,
    onSelect,
    onToggle,
  ]);

  const toggle = useCallback(() => {
    onToggle(node.path);
    if (node.isExpanded === false && node.children === undefined) {
      onGetChildren(node.path);
    }
  }, [node.children, node.path, node.isExpanded, onGetChildren, onToggle]);

  const select = useCallback(() => {
    onSelect(node.path);
  }, [node.path, onSelect]);

  const isSelected = useMemo(() => {
    const pathNoSep =
      node.path[node.path.length - 1] === separator
        ? node.path.substr(0, node.path.length - 1)
        : node.path;
    return selectedPath === pathNoSep || selectedPath === node.path;
  }, [node.path, selectedPath, separator]);

  return (
    <div>
      <div
        className={`${styles.wrapper} ${!isSelected || styles.wrapperSelected}`}
        onClick={select}
      >
        <button onClick={toggle} className={styles.toggleButton}>
          {node.isExpanded ? "-" : "+"}
        </button>
        <label className={styles.label}>{node.label}</label>
      </div>
      {children}
    </div>
  );
};

export default FileSystemItem;
