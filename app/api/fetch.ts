import wretch from "wretch";

const getFullPath = (url: string, paramPath?: string): string => {
  const fullUrl = url + (paramPath || "");
  return fullUrl;
};

export async function get<T>(
  url: string,
  query: object = {},
  paramPath?: string,
): Promise<T> {
  const fullUrl = getFullPath(url, paramPath);
  const result: T = await wretch(fullUrl).query(query).get().json();
  return result;
}

export async function post<Request extends object, Response>(
  url: string,
  query: object = {},
  json: Request,
  paramPath?: string,
): Promise<Response> {
  const fullUrl = getFullPath(url, paramPath);
  const result: Response = await wretch(fullUrl).json(json).query(query).post();
  return result;
}
