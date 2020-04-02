import * as redux from "react-redux";

import { act, renderHook } from "@testing-library/react-hooks";
import { setIsExpanded, updateFileSystem } from "./reducers";

import api from "@index/api/dirs";
import { initializeState } from "../../store";
import useGetChildrenAndParents from "./useGetChildrenAndParents";

jest.mock("react-redux");
jest.mock("@index/api/dirs");

describe("useGetChildrenAndParents", () => {
  let mockStore: ReturnType<typeof initializeState>;

  beforeEach(() => {
    mockStore = initializeState();
    mockStore.dispatch = jest.fn();

    //@ts-ignore
    redux.useDispatch.mockReturnValue(mockStore.dispatch);

    //@ts-ignore
    redux.useSelector.mockReturnValue(mockStore.getState().directoryPicker);
  });

  describe("Windows", () => {
    test("Initial useEffect", async () => {
      //@ts-ignore
      api.GET.mockReset()
        .mockResolvedValueOnce(["Users", "Windows"])
        .mockResolvedValueOnce(["username", "otheruser"])
        .mockResolvedValueOnce(["Desktop", "Downloads"]);

      const { result } = renderHook(() => useGetChildrenAndParents());
      const homedir = "C:\\Users\\username\\";

      await act(async () => {
        await result.current(homedir, "\\");
      });

      expect(api.GET).toHaveBeenNthCalledWith(1, "C:\\");
      expect(mockStore.dispatch).toHaveBeenNthCalledWith(
        1,
        updateFileSystem("C:\\", ["Users", "Windows"]),
      );

      expect(api.GET).toHaveBeenNthCalledWith(2, "C:\\Users\\");
      expect(mockStore.dispatch).toHaveBeenNthCalledWith(
        2,
        updateFileSystem("C:\\Users\\", ["username", "otheruser"]),
      );
      expect(mockStore.dispatch).toHaveBeenNthCalledWith(
        3,
        setIsExpanded("C:\\Users\\"),
      );

      expect(api.GET).toHaveBeenNthCalledWith(3, "C:\\Users\\username\\");
      expect(mockStore.dispatch).toHaveBeenNthCalledWith(
        4,
        updateFileSystem("C:\\Users\\username\\", ["Desktop", "Downloads"]),
      );
      expect(mockStore.dispatch).toHaveBeenNthCalledWith(
        5,
        setIsExpanded("C:\\Users\\username\\"),
      );
    });

    test("C:\\ root", async () => {
      //@ts-ignore
      api.GET.mockReset().mockResolvedValueOnce(["Users", "Windows"]);

      const { result } = renderHook(() => useGetChildrenAndParents());
      const dir = "C:\\";

      await act(async () => {
        await result.current(dir, "\\");
      });

      expect(api.GET).toHaveBeenNthCalledWith(1, "C:\\");
      expect(mockStore.dispatch).toHaveBeenNthCalledWith(
        1,
        updateFileSystem("C:\\", ["Users", "Windows"]),
      );
    });
  });

  describe("NIX", () => {
    test("Initial useEffect", async () => {
      //@ts-ignore
      api.GET.mockReset()
        .mockResolvedValueOnce(["home", "usr"])
        .mockResolvedValueOnce(["username", "otheruser"])
        .mockResolvedValueOnce(["Desktop", "Downloads"]);

      const { result } = renderHook(() => useGetChildrenAndParents());
      const homedir = "/home/username";

      await act(async () => {
        await result.current(homedir, "/");
      });

      expect(api.GET).toHaveBeenNthCalledWith(1, "/");
      expect(mockStore.dispatch).toHaveBeenNthCalledWith(
        1,
        updateFileSystem("/", ["home", "usr"]),
      );

      expect(api.GET).toHaveBeenNthCalledWith(2, "/home/");
      expect(mockStore.dispatch).toHaveBeenNthCalledWith(
        2,
        updateFileSystem("/home/", ["username", "otheruser"]),
      );
      expect(mockStore.dispatch).toHaveBeenNthCalledWith(
        3,
        setIsExpanded("/home/"),
      );

      expect(api.GET).toHaveBeenNthCalledWith(3, "/home/username/");
      expect(mockStore.dispatch).toHaveBeenNthCalledWith(
        4,
        updateFileSystem("/home/username/", ["Desktop", "Downloads"]),
      );
      expect(mockStore.dispatch).toHaveBeenNthCalledWith(
        5,
        setIsExpanded("/home/username/"),
      );
    });

    test("/ root", async () => {
      //@ts-ignore
      api.GET.mockReset().mockResolvedValueOnce(["home", "usr"]);

      const { result } = renderHook(() => useGetChildrenAndParents());
      const dir = "/";

      await act(async () => {
        await result.current(dir, "/");
      });

      expect(api.GET).toHaveBeenNthCalledWith(1, "/");
      expect(mockStore.dispatch).toHaveBeenNthCalledWith(
        1,
        updateFileSystem("/", ["home", "usr"]),
      );
    });
  });
});
