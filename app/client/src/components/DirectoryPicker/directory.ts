export interface FileSystem {
  roots: DirectoryItem[];
  items: { [key: string]: DirectoryItem };
}

export interface DirectoryItem {
  isExpanded: boolean;
  children: string[];
  label: string;
  id: string;
}

export const populate = (fs: FileSystem, path: string, sep: string): void => {
  let pieces = path.split(sep);
  if (!pieces[0]) {
    pieces.splice(0, 1);
  }

  let currentPath = pieces[0] + sep;
  const root: DirectoryItem = {
    isExpanded: true,
    children: [],
    label: pieces[0],
    id: currentPath,
  };
  fs.roots = [root];
  fs.items[currentPath] = root;

  let node = root;
  for (let i = 1; i < pieces.length; i++) {
    const p = pieces[i];
    currentPath += p + sep;
    const newNode: DirectoryItem = {
      isExpanded: true,
      children: [],
      label: p,
      id: currentPath,
    };
    fs.items[currentPath] = newNode;
    node.children.push(currentPath);
    node = newNode;
  }
};
