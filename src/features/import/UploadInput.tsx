"use client";

import { useState, FormEvent } from "react";
import { toast } from "react-hot-toast";

export const ImportInput = () => {
  const [file, setFile] = useState<File>();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) return;

    try {
      const data = new FormData();
      data.set("file", file);

      const res = await fetch("/api/import", {
        method: "POST",
        body: data,
      });

      if (!res.ok) return toast.error(await res.json());

      return toast.success((await res.json()).message);
    } catch (error) {
      toast.error(`${error}`);
    }
  };
  return (
    <form onSubmit={onSubmit}>
      <input
        type="file"
        name="file"
        onChange={(e) => setFile(e.target.files?.[0])}
        accept=".xlsx, .xls"
      />

      <button type="submit">Отправить</button>
    </form>
  );
};
