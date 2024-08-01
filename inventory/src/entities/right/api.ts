import type { Right } from "@prisma/client";
import { Fetcher } from "swr";

export const rightsFetcher: Fetcher<Array<Right>, string> = (url) =>
  fetch(url).then((res) => res.json());
