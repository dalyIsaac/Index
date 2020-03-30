import { IDirectoryItem, IFileSystem } from "../DirectoryPicker/directory";
import React, { useCallback, useMemo } from "react";

export interface FileSystemProps {
  items: IFileSystem["items"];
  node: IDirectoryItem;
  onToggle: (id: string) => void;
  onGetChildren: (path: string) => void;
}

const FileSystemItem = ({
  items,
  node,
  onToggle,
  onGetChildren,
}: FileSystemProps): JSX.Element => {
  const children = useMemo(() => {
    const renderedChildren = [];

    if (node.isExpanded && node.children) {
      for (const key of node.children) {
        const dir = items[key];
        renderedChildren.push(
          <div key={dir.id} style={{ paddingLeft: 25 }}>
            <FileSystemItem
              node={dir}
              items={items}
              onToggle={onToggle}
              onGetChildren={onGetChildren}
            />
          </div>,
        );
      }
    }

    return renderedChildren;
  }, [items, node.children, node.isExpanded, onGetChildren, onToggle]);

  const toggle = useCallback(() => {
    onToggle(node.id);
    if (node.isExpanded === false && node.children === undefined) {
      onGetChildren(node.id);
    }
  }, [node.children, node.id, node.isExpanded, onGetChildren, onToggle]);

  return (
    <div>
      <button onClick={toggle}>{node.isExpanded ? "-" : "+"}</button>
      {node.label}
      {children}
    </div>
  );
};

export default FileSystemItem;
