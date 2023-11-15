import React, { FC } from "react";

type PropsType = {
  image?: string | null;
};

export const Avatar: FC<PropsType> = ({ image }) => {
  return (
    <div
      className="rounded-full w-10 h-10 bg-no-repeat bg-center  bg-cover border-2 border-white"
      style={{
        backgroundImage: image ? `url(${image})` : "url('/person.svg')",
      }}
    />
  );
};
