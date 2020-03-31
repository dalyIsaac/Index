import { IDirectoryItem, getParent } from "./directory";
import {
  State,
  addRoot,
  setError,
  setOS,
  setPath,
  toggle,
  updateFileSystem,
} from "./state";

export const addRootHandler = (
  { fileSystem: fs }: State,
  { payload: path }: ReturnType<typeof addRoot>,
) => {
  const root: IDirectoryItem = {
    path,
    label: path,
    isExpanded: true,
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
