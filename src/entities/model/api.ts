import { Fetcher } from "swr";
import { IModel } from "./lib/types";

export const modelsFetcher: Fetcher<Array<IModel>, string> = (url) =>
  fetch(url).then((res) => res.json());