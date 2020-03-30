import { IDirectoryItem, IFileSystem } from "../DirectoryPicker/directory";
import React, { useCallback, useMemo } from "react";

export interface FileSystemProps {
  items: IFileSystem["items"];
  node: IDirectoryItem;
  onToggle: (id: string) => void;
}

const FileSystemItem = ({
  items,
  node,
  onToggle,
}: FileSystemProps): JSX.Element => {
  const children = useMemo(() => {
    const renderedChildren = [];

    if (node.isExpanded) {
      for (const key of node.children) {
        const dir = items[key];
        renderedChildren.push(
          <div key={dir.id} style={{ paddingLeft: 25 }}>
            <FileSystemItem node={dir} items={items} onToggle={onToggle} />
          </div>,
        );
      }
    }

    return renderedChildren;
  }, [items, node.children, node.isExpanded, onToggle]);

  const toggle = useCallback(() => {
    onToggle(node.id);
  }, [node.id, onToggle]);

  return (
    <div>
      <button onClick={toggle}>+</button>
      {node.label}
      {children}
    </div>
  );
};

export default FileSystemItem;
