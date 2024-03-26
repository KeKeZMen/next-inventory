import { Fetcher } from "swr";
import { IPlace } from "./lib/types";

export const placesFetcher: Fetcher<Array<IPlace>, string> = (url) =>
  fetch(url).then((res) => res.json());
