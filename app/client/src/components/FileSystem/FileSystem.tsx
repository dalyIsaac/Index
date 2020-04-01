import React, { useMemo } from "react";

import FileSystemItem from "./FileSystemItem";
import { IFileSystem } from "../DirectoryPicker/state";
import { Separator } from "./state";

export interface FileSystemProps extends IFileSystem {
  onToggle: (path: string) => void;
  onSelect: (path: string) => void;
  onGetChildren: (path: string) => void;
}

const FileSystem = ({
  roots,
  items,
  separator,
  onToggle,
  onGetChildren,
  onSelect,
}: FileSystemProps): JSX.Element => {
  const children = useMemo(() => {
    const renderedChildren = [];

    for (const key of roots) {
      const dir = items[key];
      renderedChildren.push(
        <FileSystemItem
          key={dir.path}
          node={dir}
          items={items}
          onToggle={onToggle}
          onGetChildren={onGetChildren}
          onSelect={onSelect}
        />,
      );
    }

    return renderedChildren;
  }, [items, onGetChildren, onSelect, onToggle, roots]);
  return (
    <div>
      <Separator.Provider value={separator}>{children}</Separator.Provider>
    </div>
  );
};

export default FileSystem;
