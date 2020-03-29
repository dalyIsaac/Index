import wretch from "wretch";

export async function get<T>(
  url: string,
  query: object = {},
  paramPath?: string,
): Promise<T> {
  const fullUrl = url + (paramPath || "");
  const result: T = await wretch(fullUrl).query(query).get().json();
  return result;
}
