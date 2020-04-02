import * as redux from "react-redux";

import { act, renderHook } from "@testing-library/react-hooks";
import {
  addRoot,
  setIsExpanded,
  setOS,
  setPath,
  updateFileSystem,
} from "./reducers";

import { initializeState } from "../../store";
import useGetChildrenAndParents from "./useGetChildrenAndParents";
import useOnUpdatedPath from "./useOnUpdatedPath";

jest.mock("react-redux");
jest.mock("./useGetChildrenAndParents");

describe("useOnUpdatedPath", () => {
  let mockStore: ReturnType<typeof initializeState>;
  let actualDispatch: ReturnType<typeof initializeState>["dispatch"];
  let getChildrenAndParents: jest.Mock;

  beforeEach(() => {
    mockStore = initializeState();
    actualDispatch = mockStore.dispatch;
    mockStore.dispatch = jest.fn();

    //@ts-ignore
    redux.useDispatch.mockReturnValue(mockStore.dispatch);

    getChildrenAndParents = jest.fn();
    //@ts-ignore
    useGetChildrenAndParents.mockReturnValue(getChildrenAndParents);

    const homedir = "C:\\Users\\username";
    const separator = "\\";
    const os = "os";

    actualDispatch(setOS(os));
    actualDispatch(setPath(homedir, separator));
    actualDispatch(addRoot("C:\\"));

    actualDispatch(updateFileSystem("C:\\", ["Users", "Windows"]));
    actualDispatch(updateFileSystem("C:\\Users\\", ["username"]));
    actualDispatch(
      updateFileSystem("C:\\Users\\username", ["Desktop", "Downloads"]),
    );
  });

  test("Path with ending separator and gets children", async () => {
    const path = "C:\\Users\\username\\Desktop\\";
    actualDispatch(setPath(path));

    //@ts-ignore
    redux.useSelector.mockReturnValue(mockStore.getState().directoryPicker);

    const { result } = renderHook(() => useOnUpdatedPath());
    const onUpdatedPath = result.current;

    await act(async () => {
      await onUpdatedPath();
    });

    expect(mockStore.dispatch).toHaveBeenNthCalledWith(1, setIsExpanded(path));
    expect(getChildrenAndParents).toHaveBeenCalledWith(path);
  });

  test("Path with ending separator, but doesn't get children", async () => {
    const path = "C:\\Users\\username\\";
    actualDispatch(setPath(path));

    //@ts-ignore
    redux.useSelector.mockReturnValue(mockStore.getState().directoryPicker);

    const { result } = renderHook(() => useOnUpdatedPath());
    const onUpdatedPath = result.current;

    await act(async () => {
      await onUpdatedPath();
    });

    expect(mockStore.dispatch).toHaveBeenNthCalledWith(1, setIsExpanded(path));
    expect(getChildrenAndParents).toHaveBeenCalledTimes(0);
  });

  test("Path with no ending separator, and doesn't get children", async () => {
    const path = "C:\\Users\\username";
    actualDispatch(setPath(path));

    //@ts-ignore
    redux.useSelector.mockReturnValue(mockStore.getState().directoryPicker);

    const { result } = renderHook(() => useOnUpdatedPath());
    const onUpdatedPath = result.current;

    await act(async () => {
      await onUpdatedPath();
    });

    expect(mockStore.dispatch).toHaveBeenCalledTimes(0);
    expect(getChildrenAndParents).toHaveBeenCalledTimes(0);
  });

  test("Path with no ending separator, and gets children", async () => {
    const path = "C:\\Users\\username\\Desktop";
    actualDispatch(setPath(path));

    //@ts-ignore
    redux.useSelector.mockReturnValue(mockStore.getState().directoryPicker);

    const { result } = renderHook(() => useOnUpdatedPath());
    const onUpdatedPath = result.current;

    await act(async () => {
      await onUpdatedPath();
    });

    expect(mockStore.dispatch).toHaveBeenCalledTimes(0);
    expect(getChildrenAndParents).toHaveBeenNthCalledWith(1, path + "\\");
  });
});
