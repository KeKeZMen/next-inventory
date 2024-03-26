import { Fetcher } from "swr";
import type { Model } from "@prisma/client";

export const modelsFetcher: Fetcher<Array<Model>, string> = (url) =>
  fetch(url).then((res) => res.json());
