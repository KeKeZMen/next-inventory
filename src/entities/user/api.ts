import { User } from "next-auth";
import { Fetcher } from "swr";

export const usersFetcher: Fetcher<Array<User>, string> = (url) =>
  fetch(url).then((res) => res.json());
