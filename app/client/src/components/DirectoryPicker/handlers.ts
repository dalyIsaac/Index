import {
  DirectoryPickerState,
  addRoot,
  setError,
  setIsExpanded,
  setOS,
  setPath,
  toggle,
  updateFileSystem,
} from "./state";
import { IDirectoryItem, addSeparator, getParent } from "./directory";

export const addRootHandler = (
  { fileSystem: fs }: DirectoryPickerState,
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
  state: DirectoryPickerState,
  { payload: { path, separator } }: ReturnType<typeof setPath>,
) => {
  if (separator) {
    state.fileSystem.separator = separator;
  }

  const prevParent = getParent(state.path, state.fileSystem.separator);
  const newParent = getParent(path, state.fileSystem.separator);
  state.differentParent = newParent !== prevParent;

  state.path = path;

  /**
   * If the path ends with a separator, then the path was updated from
   * keyboard entry, and the node should be expanded.
   */
  if (path[path.length - 1] === state.fileSystem.separator) {
    const node = state.fileSystem.items[path];
    if (node) {
      node.isExpanded = true;
    }
  }
};

export const setErrorHandler = (
  state: DirectoryPickerState,
  { payload }: ReturnType<typeof setError>,
) => {
  state.error = Array.isArray(payload) ? payload.join("\n") : payload;
};

export const setOSHandler = (
  state: DirectoryPickerState,
  { payload }: ReturnType<typeof setOS>,
) => {
  state.os = payload;
};

export const updateFileSystemHandler = (
  { fileSystem: fs }: DirectoryPickerState,
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

    const fullPath = addSeparator(parent + d, sep);
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
  state: DirectoryPickerState,
  { payload }: ReturnType<typeof toggle>,
) => {
  const item = state.fileSystem.items[payload];
  item.isExpanded = !item.isExpanded;
};

export const setIsExpandedHandler = (
  state: DirectoryPickerState,
  { payload: { path, isExpanded } }: ReturnType<typeof setIsExpanded>,
) => {
  state.fileSystem.items[path].isExpanded = isExpanded;
};
