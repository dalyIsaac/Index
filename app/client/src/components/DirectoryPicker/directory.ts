import {
  State,
  setError,
  setInitialFileSystem,
  setOS,
  setPath,
  toggle,
  updateFileSystem,
} from "./state";

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

export const addRoot = (fs: IFileSystem, path: string): void => {
  const root: IDirectoryItem = {
    path,
    label: path,
    isExpanded: false,
  };

  fs.roots.push(path);
  fs.items[path] = root;
};

export const setPathHandler = (
  state: State,
  { payload: { path, separator } }: ReturnType<typeof setPath>,
) => {
  if (separator) {
    state.fileSystem.separator = separator;
  }

  const prevParent = getParent(state.path, state.fileSystem.separator);
  const newParent = getParent(path, state.fileSystem.separator);
  state.differentParent = newParent !== prevParent;

  state.path = path;
};

export const setErrorHandler = (
  state: State,
  { payload }: ReturnType<typeof setError>,
) => {
  state.error = Array.isArray(payload) ? payload.join("\n") : payload;
};

export const setOSHandler = (
  state: State,
  { payload }: ReturnType<typeof setOS>,
) => {
  state.os = payload;
};

export const setInitialFileSystemHandler = (
  { fileSystem: fs }: State,
  { payload: path }: ReturnType<typeof setInitialFileSystem>,
): void => {
  const { separator: sep } = fs;
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

export const updateFileSystemHandler = (
  { fileSystem: fs }: State,
  { payload: { parent, dirs } }: ReturnType<typeof updateFileSystem>,
) => {
  const { separator: sep } = fs;
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

export const toggleHandler = (
  state: State,
  { payload }: ReturnType<typeof toggle>,
) => {
  const item = state.fileSystem.items[payload];
  item.isExpanded = !item.isExpanded;
};
