import {
  addRootHandler,
  setErrorHandler,
  setIsExpandedHandler,
  setOSHandler,
  setPathHandler,
  toggleHandler,
  updateFileSystemHandler,
} from "./handlers";

import { DirectoryPickerState } from "./state";

const createState = (
  state: { [key: string]: any } = {},
): DirectoryPickerState => {
  return {
    differentParent: true,
    error: "",
    os: "",
    path: "",
    ...state,
    fileSystem: { items: {}, roots: [], separator: "", ...state?.fileSystem },
  };
};

describe("addRootHandler", () => {
  test("Add a root path to the IFileSystem instance", () => {
    const state = createState({ fileSystem: { separator: "/" } });
    addRootHandler(state, {
      payload: "/",
      type: "addRoot",
    });

    expect(state).toStrictEqual(
      createState({
        fileSystem: {
          items: { "/": { isExpanded: true, label: "/", path: "/" } },
          roots: ["/"],
          separator: "/",
        },
      }),
    );
  });

  test("Add a second root path to the IFileSystem instance", () => {
    const state = createState({
      fileSystem: {
        items: { "C:\\": { isExpanded: false, label: "C:\\", path: "C:\\" } },
        roots: ["C:\\"],
        separator: "\\",
      },
    });

    addRootHandler(state, {
      payload: "D:\\",
      type: "addRoot",
    });

    expect(state).toStrictEqual(
      createState({
        fileSystem: {
          items: {
            "C:\\": { isExpanded: false, label: "C:\\", path: "C:\\" },
            "D:\\": {
              isExpanded: true,
              label: "D:\\",
              path: "D:\\",
            },
          },
          roots: ["C:\\", "D:\\"],
          separator: "\\",
        },
      }),
    );
  });
});

describe("setPathHandler", () => {
  test("Same parent", () => {
    const state = createState({ path: "/home/paul/", differentParent: true });
    setPathHandler(state, {
      payload: { path: "/home/brad", separator: "/" },
      type: "path",
    });

    const expected = createState({
      fileSystem: { separator: "/" },
      path: "/home/brad",
      differentParent: false,
    });

    expect(state).toStrictEqual(expected);
  });

  test("Different parent", () => {
    const state = createState({ path: "/home/paul/", differentParent: false });
    setPathHandler(state, {
      payload: { path: "/otherhome/brad", separator: "/" },
      type: "path",
    });

    const expected = createState({
      fileSystem: { separator: "/" },
      path: "/otherhome/brad",
      differentParent: true,
    });

    expect(state).toStrictEqual(expected);
  });
});

describe("setPathHandler", () => {
  test("String", () => {
    const state = createState();

    setErrorHandler(state, { payload: "Hello world!", type: "error" });

    expect(state).toStrictEqual(createState({ error: "Hello world!" }));
  });

  test("String array", () => {
    const state = createState();

    setErrorHandler(state, { payload: ["Error 1", "Error 2"], type: "error" });

    expect(state).toStrictEqual(createState({ error: "Error 1\nError 2" }));
  });
});

describe("setOSHandler", () => {
  test("Windows", () => {
    const state = createState();

    setOSHandler(state, { payload: "Windows", type: "OS" });

    expect(state).toStrictEqual(createState({ os: "Windows" }));
  });
});

describe("updateFileSystemHandler", () => {
  describe("*NIX", () => {
    test("Adding to the root", () => {
      const state = createState({
        fileSystem: {
          items: { "/": { label: "/", path: "/", isExpanded: true } },
          roots: ["/"],
          separator: "/",
        },
      });

      updateFileSystemHandler(state, {
        payload: { parent: "/", dirs: ["home", "usr"] },
        type: "children",
      });

      expect(state).toStrictEqual(
        createState({
          fileSystem: {
            items: {
              "/": {
                label: "/",
                path: "/",
                isExpanded: true,
                children: ["/home/", "/usr/"],
              },
              "/home/": {
                isExpanded: false,
                label: "home",
                path: "/home/",
              },
              "/usr/": {
                isExpanded: false,
                label: "usr",
                path: "/usr/",
              },
            },
            roots: ["/"],
            separator: "/",
          },
        }),
      );
    });

    test("Adding to not the root", () => {
      const state = createState({
        fileSystem: {
          items: {
            "/": { label: "/", path: "/", isExpanded: true },
            "/home/": {
              isExpanded: false,
              label: "home",
              path: "/home/",
            },
          },
          roots: ["/"],
          separator: "/",
        },
      });

      updateFileSystemHandler(state, {
        payload: { parent: "/home/", dirs: ["username"] },
        type: "children",
      });

      expect(state).toStrictEqual(
        createState({
          fileSystem: {
            items: {
              "/": { label: "/", path: "/", isExpanded: true },
              "/home/": {
                isExpanded: false,
                label: "home",
                path: "/home/",
                children: ["/home/username/"],
              },
              "/home/username/": {
                label: "username",
                path: "/home/username/",
                isExpanded: false,
              },
            },
            roots: ["/"],
            separator: "/",
          },
        }),
      );
    });
  });

  describe("Windows", () => {
    test("Adding to the root", () => {
      const state = createState({
        fileSystem: {
          items: { "C:\\": { label: "C:", path: "C:\\", isExpanded: true } },
          roots: ["C:\\"],
          separator: "\\",
        },
      });

      updateFileSystemHandler(state, {
        payload: { parent: "C:\\", dirs: ["Users", "Windows"] },
        type: "children",
      });

      expect(state).toStrictEqual(
        createState({
          fileSystem: {
            items: {
              "C:\\": {
                label: "C:",
                path: "C:\\",
                isExpanded: true,
                children: ["C:\\Users\\", "C:\\Windows\\"],
              },
              "C:\\Users\\": {
                label: "Users",
                path: "C:\\Users\\",
                isExpanded: false,
              },
              "C:\\Windows\\": {
                label: "Windows",
                path: "C:\\Windows\\",
                isExpanded: false,
              },
            },
            roots: ["C:\\"],
            separator: "\\",
          },
        }),
      );
    });

    test("Adding to not the root", () => {
      const state = createState({
        fileSystem: {
          items: {
            "C:\\": {
              label: "C:",
              path: "C:\\",
              isExpanded: true,
              children: ["C:\\Users\\", "C:\\Windows\\"],
            },
            "C:\\Users\\": {
              label: "Users",
              path: "C:\\Users\\",
              isExpanded: false,
            },
          },
          roots: ["C:\\"],
          separator: "\\",
        },
      });

      updateFileSystemHandler(state, {
        payload: { parent: "C:\\Users\\", dirs: ["username"] },
        type: "children",
      });

      expect(state).toStrictEqual(
        createState({
          fileSystem: {
            items: {
              "C:\\": {
                label: "C:",
                path: "C:\\",
                isExpanded: true,
                children: ["C:\\Users\\", "C:\\Windows\\"],
              },
              "C:\\Users\\": {
                label: "Users",
                path: "C:\\Users\\",
                isExpanded: false,
                children: ["C:\\Users\\username\\"],
              },
              "C:\\Users\\username\\": {
                label: "username",
                path: "C:\\Users\\username\\",
                isExpanded: false,
              },
            },
            roots: ["C:\\"],
            separator: "\\",
          },
        }),
      );
    });
  });
});

describe("toggleHandler", () => {
  test("toggleHandler", () => {
    const state = createState({
      fileSystem: {
        items: {
          "C:\\": {
            label: "C:",
            path: "C:\\",
            isExpanded: true,
            children: ["C:\\Users\\", "C:\\Windows\\"],
          },
          "C:\\Users\\": {
            label: "Users",
            path: "C:\\Users\\",
            isExpanded: false,
          },
        },
        roots: ["C:\\"],
        separator: "\\",
      },
    });

    toggleHandler(state, { payload: "C:\\Users\\", type: "toggle" });

    expect(state).toStrictEqual(
      createState({
        fileSystem: {
          items: {
            "C:\\": {
              label: "C:",
              path: "C:\\",
              isExpanded: true,
              children: ["C:\\Users\\", "C:\\Windows\\"],
            },
            "C:\\Users\\": {
              label: "Users",
              path: "C:\\Users\\",
              isExpanded: true,
            },
          },
          roots: ["C:\\"],
          separator: "\\",
        },
      }),
    );
  });
});

describe("setIsExpandedHandler", () => {
  test("Explicit setIsExpandedHandler", () => {
    const state = createState({
      fileSystem: {
        items: {
          "C:\\": {
            label: "C:",
            path: "C:\\",
            isExpanded: true,
            children: ["C:\\Users\\", "C:\\Windows\\"],
          },
          "C:\\Users\\": {
            label: "Users",
            path: "C:\\Users\\",
            isExpanded: false,
          },
        },
        roots: ["C:\\"],
        separator: "\\",
      },
    });

    setIsExpandedHandler(state, {
      payload: { path: "C:\\Users\\", isExpanded: true },
      type: "setIsExpanded",
    });

    expect(state).toStrictEqual(
      createState({
        fileSystem: {
          items: {
            "C:\\": {
              label: "C:",
              path: "C:\\",
              isExpanded: true,
              children: ["C:\\Users\\", "C:\\Windows\\"],
            },
            "C:\\Users\\": {
              label: "Users",
              path: "C:\\Users\\",
              isExpanded: true,
            },
          },
          roots: ["C:\\"],
          separator: "\\",
        },
      }),
    );
  });
});
