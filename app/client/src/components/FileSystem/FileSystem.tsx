import React, { useMemo } from "react";

import FileSystemItem from "./FileSystemItem";
import { IFileSystem } from "../DirectoryPicker/directory";

export interface FileSystemProps extends IFileSystem {
  onToggle: (id: string) => void;
}

const FileSystem = ({
  roots,
  items,
  onToggle,
}: FileSystemProps): JSX.Element => {
  const children = useMemo(() => {
    const renderedChildren = [];

    for (const key of roots) {
      const dir = items[key];
      renderedChildren.push(
        <FileSystemItem
          key={dir.id}
          node={dir}
          items={items}
          onToggle={onToggle}
        />,
      );
    }

    return renderedChildren;
  }, [items, onToggle, roots]);
  return <div>{children}</div>;
};

export default FileSystem;
