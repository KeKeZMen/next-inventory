"use client";

import { ReactNode, createContext, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { useWindowSize } from "@/shared";

export const MenuContext = createContext({
  isOpenedMenu: true,
  handleMenu: () => {},
});

export const Providers = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  const [isOpenedMenu, setIsOpenedMenu] = useState(false);
  const { width } = useWindowSize();
  const handleMenu = () => {
    setIsOpenedMenu((prev) => !prev);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (width && width >= 640) setIsOpenedMenu(true);
  }, [width]);

  if (!mounted) return <>{children}</>;

  return (
    <SessionProvider>
      <ThemeProvider attribute="class">
        <Toaster />
        <MenuContext.Provider value={{ isOpenedMenu, handleMenu }}>
          {children}
        </MenuContext.Provider>
      </ThemeProvider>
    </SessionProvider>
  );
};
