import { Fetcher } from "swr";
import type { Type } from "@prisma/client";

export const typesFetcher: Fetcher<Array<Type>, string> = (url) =>
  fetch(url).then((res) => res.json());
