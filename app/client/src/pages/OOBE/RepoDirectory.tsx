import DirectoryPicker from "../../components/DirectoryPicker";
import { HEADER_HEIGHT } from "../../components/Header";
import React from "react";

const RepoDirectory = (): JSX.Element => {
  return <DirectoryPicker height={`calc(100vh - ${HEADER_HEIGHT})`} />;
};

export default RepoDirectory;
