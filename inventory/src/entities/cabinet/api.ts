import type { Cabinet } from "@prisma/client";
import { Fetcher } from "swr";

export const cabinetsFetcher: Fetcher<Array<Cabinet>, string> = (url) =>
  fetch(url).then((res) => res.json());
