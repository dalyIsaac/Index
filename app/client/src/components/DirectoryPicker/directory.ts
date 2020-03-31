export interface IFileSystem {
  roots: string[];
  items: { [key: string]: IDirectoryItem };
  separator: string;
}

export interface IDirectoryItem {
  isExpanded: boolean;
  children?: string[];
  label: string;
  path: string;
}

export const getParent = (path: string, separator: string): string => {
  const pieces = path.split(separator);
  if (pieces.length === 0) {
    return "";
  }
  if (pieces[pieces.length - 1] === "") {
    pieces.pop();
  }

  pieces.pop();

  let parent = pieces.join(separator);
  if (parent !== separator) {
    parent += separator;
  }
  return parent;
};

export const addSeparator = (path: string, separator: string): string => {
  let newPath = path;
  if (path[path.length - 1] !== separator) {
    newPath += separator;
  }
  return newPath;
};
