"use client";

import { ReactNode, FC, useCallback, useEffect } from "react";

type PropsType = {
  onClose: (val: boolean) => void;
  children: ReactNode;
};

export const Modal: FC<PropsType> = ({ children, onClose }) => {
  const handleEscapeModal = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose(false);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleEscapeModal);

    return () => {
      document.removeEventListener("keydown", handleEscapeModal);
    };
  }, []);

  return (
    <div
      onClick={() => onClose(false)}
      className="bg-black/50 w-full h-full flex justify-center items-center fixed top-0 left-0 z-50 "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg p-5 md:p-10 max-h-[500px] overflow-y-auto md:max-h-screen"
      >
        {children}
      </div>
    </div>
  );
};
