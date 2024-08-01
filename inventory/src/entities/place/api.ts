import { Fetcher } from "swr";
import type { Place } from "@prisma/client";

export const placesFetcher: Fetcher<Array<Place>, string> = (url) =>
  fetch(url).then((res) => res.json());
