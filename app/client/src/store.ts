import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { reducer as directoryPicker } from "./components/DirectoryPicker/state";

const initializeReducer = () => combineReducers({ directoryPicker });

export const initializeState = () => {
  const rootReducer = initializeReducer();

  return configureStore({ reducer: rootReducer });
};

export type State = ReturnType<ReturnType<typeof initializeReducer>>;
