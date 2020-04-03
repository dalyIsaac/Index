import { API_REPO } from "./_root";
import { get } from "../fetch";

export const API_REPO_OPEN = API_REPO + "/open";

export const open = {
  API: API_REPO_OPEN,
  GET: () => get(API_REPO_OPEN),
};
