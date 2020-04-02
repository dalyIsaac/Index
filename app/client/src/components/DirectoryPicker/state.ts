export interface IFileSystem {
  roots: string[];
  items: { [key: string]: IDirectoryItem };
  separator: string;
}

export interface IDirectoryItem {
  isExpanded: boolean;

  /**
   * Stores the paths of the children. If this isn't defined, then the children
   * haven't been retrieved.
   */
  children?: string[];
  label: string;
  path: string;
}
