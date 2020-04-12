import fs from "fs";
import pify from "pify";
import steno from "steno";

/**
 * Removes the last item if `item === ""`.
 * @param pieces
 */
export const removeEmptyTrailing = (pieces: string[]): string[] => {
  if (pieces[pieces.length - 1] === "") {
    pieces.pop();
  }
  return pieces;
};

export const getParent = (path: string, separator: string): string => {
  if (path.length === 0 || path === separator) {
    return "";
  }

  const pieces = removeEmptyTrailing(path.split(separator));

  if (pieces.length === 1) {
    return "";
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

export const checkExists = async (path: string): Promise<boolean> => {
  try {
    await fs.promises.access(path);
    return true;
  } catch (error) {
    return false;
  }
};

// steno has atomic writing and race condition prevention
const _writeFile = pify(steno.writeFile);

export const writeFile = (path: string, data: string) => {
  return _writeFile(path, data);
};
