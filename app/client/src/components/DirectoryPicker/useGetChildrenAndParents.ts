import { addSeparator, removeEmptyTrailing } from "@index/helpers";
import { setError, setIsExpanded, updateFileSystem } from "./reducers";
import { useDispatch, useSelector } from "react-redux";

import { State } from "../../store";
import api from "@index/api/dirs";

const useGetChildrenAndParents = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: State) => state.directoryPicker);

  return async (path: string, separator?: string) => {
    const fs = state.fileSystem;

    // For when the separator hasn't propagated through the state.
    let sep = separator;
    if (!sep) {
      ({ separator: sep } = state.fileSystem);
    }

    // Each piece is a level up of the path.
    const pieces = removeEmptyTrailing(path.split(sep));
    let currentPath = "";

    let parent = "";
    for (let p of pieces) {
      currentPath += p;
      currentPath = addSeparator(currentPath, sep);
      const currentNode = fs.items[currentPath];

      // Only gets if the path doesn't exist, or the children array doesn't
      // exist.
      if (!currentNode || !currentNode.children) {
        try {
          const dirs = await api.GET(currentPath);
          dispatch(updateFileSystem(currentPath, dirs));
          if (parent) {
            dispatch(setIsExpanded(currentPath));
          }
          parent = currentPath;
        } catch (error) {
          dispatch(setError(error));
        }
      }
    }
  };
};

export default useGetChildrenAndParents;
