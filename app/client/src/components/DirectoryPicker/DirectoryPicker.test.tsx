import Enzyme, { mount } from "enzyme";
import { addRoot, setOS, setPath } from "./state";

import DirectoryPicker from "./DirectoryPicker";
import EnzymeAdapter from "enzyme-adapter-react-16";
import { Provider } from "react-redux";
import React from "react";
// eslint-disable-next-line import/first
import api from "@index/api/dirs";
import { initializeState } from "../../store";

jest.mock("@index/api/dirs");

Enzyme.configure({ adapter: new EnzymeAdapter() });

describe("<DirectoryPicker />", () => {
  const getWrapper = (store: ReturnType<typeof initializeState>) =>
    mount(
      <Provider store={store}>
        <DirectoryPicker />
      </Provider>,
    );

  test("Initial render in Windows", async () => {
    const mockStore = initializeState();
    mockStore.dispatch = jest.fn();

    const homedir = "C:\\Users\\username";
    const separator = "\\";
    const os = "os";

    //@ts-ignore
    api.home.GET.mockResolvedValue({
      homedir,
      separator,
      os,
    });

    const wrapper = await getWrapper(mockStore);
    wrapper.update();

    // Inside the useEffect
    expect(api.home.GET).toHaveBeenCalled();
    expect(mockStore.dispatch).toHaveBeenNthCalledWith(1, setOS(os));
    expect(mockStore.dispatch).toHaveBeenNthCalledWith(
      2,
      setPath(homedir, separator),
    );
    expect(mockStore.dispatch).toHaveBeenNthCalledWith(3, addRoot("C:"));
  });

  // TODO: Test getChildrenAndParents with the expected inputs from above

  test("Initial render in *NIX", async () => {
    const mockStore = initializeState();
    mockStore.dispatch = jest.fn();

    const homedir = "/home/username";
    const separator = "/";
    const os = "os";

    //@ts-ignore
    api.home.GET.mockReset();
    //@ts-ignore
    api.home.GET.mockResolvedValue({
      homedir,
      separator,
      os,
    });

    const wrapper = await getWrapper(mockStore);
    wrapper.update();

    // Inside the useEffect
    expect(api.home.GET).toHaveBeenCalled();
    expect(mockStore.dispatch).toHaveBeenNthCalledWith(1, setOS(os));
    expect(mockStore.dispatch).toHaveBeenNthCalledWith(
      2,
      setPath(homedir, separator),
    );
    expect(mockStore.dispatch).toHaveBeenNthCalledWith(3, addRoot("/"));
  });

  // TODO: Test getChildrenAndParents with the expected inputs from above
});
