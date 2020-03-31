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

  pieces.pop();
  return pieces.join(separator);
};

export const populate = (fs: IFileSystem, path: string, sep: string): void => {
  let pieces = path.split(sep);
  let currentPath: string = "";
  if (!pieces[0]) {
    pieces.splice(0, 1);
    currentPath = sep;
  }

  currentPath += pieces[0] + sep;
  const root: IDirectoryItem = {
    isExpanded: true,
    children: [],
    label: pieces[0],
    path: currentPath,
  };
  fs.roots = [currentPath];
  fs.items[currentPath] = root;

  let node = root;
  for (let i = 1; i < pieces.length; i++) {
    const p = pieces[i];
    currentPath += p + sep;
    const newNode: IDirectoryItem = {
      isExpanded: false,
      label: p,
      path: currentPath,
    };
    fs.items[currentPath] = newNode;
    node.children = [currentPath];
    node.isExpanded = true;
    node = newNode;
  }
};

export const updateFileSystem = (
  fs: IFileSystem,
  parent: string,
  dirs: string[],
  sep: string,
) => {
  const parentNode = fs.items[parent];
  parentNode.children = [];

  for (const d of dirs) {
    const pieces = d.split(sep);
    if (!pieces[0]) {
      pieces.splice(0, 1);
    }

    const fullPath = parent + d + sep;
    const node: IDirectoryItem = {
      isExpanded: false,
      label: pieces[pieces.length - 1],
      path: fullPath,
    };
    fs.items[fullPath] = node;
    parentNode.children.push(fullPath);
  }
};
