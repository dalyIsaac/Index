import { addSeparator, getParent } from "./directory";
import { useDispatch, useSelector } from "react-redux";

import { State } from "../../store";
import { setIsExpanded } from "./state";
import useGetChildrenAndParents from "./useGetChildrenAndParents";
import { useRef } from "react";

const useOnUpdatedPath = () => {
  const state = useSelector((state: State) => state.directoryPicker);
  const dispatch = useDispatch();

  const previousNewPath = useRef("");
  const getChildrenAndParents = useGetChildrenAndParents();
  return () => {
    const newPath = addSeparator(state.path, state.fileSystem.separator);
    // Prevents unnecessary requests, as useEffect will be triggered by various
    // updates to the state, which aren't path updates.
    if (newPath !== previousNewPath.current) {
      previousNewPath.current = newPath;

      const node = state.fileSystem.items[newPath];
      // Expands if input from keyboard, as mouse input doesn't have a separator
      // at the end.
      if (node && newPath === state.path) {
        dispatch(setIsExpanded(newPath));
      }

      if (node && node.children === undefined) {
        getChildrenAndParents(newPath);
      } else if (!node) {
        const parent = getParent(newPath, state.fileSystem.separator);
        const parentNode = state.fileSystem.items[parent];

        if (parentNode && !parentNode.isExpanded) {
          dispatch(setIsExpanded(parent, true));
          if (!parentNode.children) {
            getChildrenAndParents(newPath);
          }
        }
      }
    }
  };
};

export default useOnUpdatedPath;
