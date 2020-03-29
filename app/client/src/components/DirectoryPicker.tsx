import React, { useCallback, useEffect, useState } from "react";

import api from "@index/api/dirs";

const getTop = (path: string): string => {
  const pieces = path.split("/");
  if (pieces.length === 0) {
    return "";
  }
  let last = pieces[pieces.length - 1];
  if (last === "") {
    last = pieces[pieces.length - 2] || "";
  }
  return last;
};

const DirectoryPicker = (): JSX.Element => {
  const [path, setPath] = useState("");
  const [dirs, setDirs] = useState<string[]>([]);
  const [os, setOS] = useState("");
  const [separator, setSeparator] = useState("");
  const [top, setTop] = useState(""); // the highest level directory

  const getDirs = useCallback(() => {
    api.GET(path).then((dirs) => {
      setDirs(dirs);
    });
    // fetch(`/api/dirs?path=${path}`)
    //   .then((res) => res.json())
    //   .then(({ dirs }) => {
    //     setDirs(dirs);
    //   });
  }, [path]);

  useEffect(() => {
    api.home.GET().then(({ homedir, os, separator }) => {
      setPath(homedir);
      setOS(os);
      setSeparator(separator);
    });
    // fetch("/api/dirs/home")
    //   .then((res) => res.json())
    //   .then(({ homedir }: Home) => {
    //     setPath(homedir);
    //     setTop(getTop(homedir));
    //     getDirs();
    //   });
  }, [getDirs]);

  const onChangeText = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPath(e.target.value);
      const newTop = getTop(e.target.value);
      if (newTop !== top) {
        console.log("Getting more dirs");
        setTop(newTop);
        getDirs();
      }
    },
    [getDirs, top],
  );

  return (
    <div>
      <input type="text" value={path} onChange={onChangeText} />
      {dirs}
    </div>
  );
};

export default DirectoryPicker;
