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

/**
 * Writes to a file which already exists. This has atomic writing and race
 * condition prevention.
 * @param path The path of the file to write to.
 * @param data The data to write to the file.
 */
export const writeToFile = (path: string, data: string) => {
  return _writeFile(path, data);
};

/**
 * Creates a new file, and populates it with the given data.
 * @param path The path of the file to write to.
 * @param data The data to write to the file.
 */
export const writeNewFile = (path: string, data: string) => {
  return fs.promises.writeFile(path, data);
};
