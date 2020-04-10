import DirectoryPicker from "../../components/DirectoryPicker";
import { HEADER_HEIGHT } from "../../components/Header";
import React from "react";
import SettingsPage from "../../components/SettingsPage";

const RepoDirectory = (): JSX.Element => {
  return (
    <SettingsPage
      title="Select a directory"
      description="Select a directory in which the logs for index will reside."
    >
      <DirectoryPicker height={`calc(100vh - ${HEADER_HEIGHT})`} />
    </SettingsPage>
  );
};

export default RepoDirectory;
