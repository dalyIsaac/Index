import { addSeparator, getParent } from "./directory";

describe("getParent", () => {
  describe("*NIX", () => {
    test("Given empty string", () => {
      expect(getParent("", "/")).toBe("");
    });

    test("Given *NIX root", () => {
      expect(getParent("/", "/")).toBe("");
    });

    test("Given single level with no trailing separator", () => {
      expect(getParent("/home", "/")).toBe("/");
    });

    test("Given a single level with trailing separator", () => {
      expect(getParent("/home/", "/")).toBe("/");
    });

    test("Given multiple levels with no trailing separator", () => {
      expect(getParent("/home/username", "/")).toBe("/home/");
    });

    test("Given multiple levels with trailing separator", () => {
      expect(getParent("/home/username/", "/")).toBe("/home/");
    });
  });

  describe("Windows", () => {
    test("Given empty string", () => {
      expect(getParent("", "\\")).toBe("");
    });

    test("Given a single level", () => {
      expect(getParent("C:\\", "\\")).toBe("");
    });

    test("Given multiple levels with no trailing separator", () => {
      expect(getParent("C:\\Users", "\\")).toBe("C:\\");
    });

    test("Given multiple levels with trailing separator", () => {
      expect(getParent("C:\\Users\\", "\\")).toBe("C:\\");
    });
  });
});

describe("addSeparator", () => {
  test("Given empty string", () => {
    expect(addSeparator("", "/")).toBe("/");
  });

  test("Given no trailing separator", () => {
    expect(addSeparator("/home/username", "/")).toBe("/home/username/");
  });

  test("Given trailing separator", () => {
    expect(addSeparator("/home/username/", "/")).toBe("/home/username/");
  });
});
