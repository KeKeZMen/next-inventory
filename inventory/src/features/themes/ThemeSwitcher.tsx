"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  setTheme("light");

  const handleChangeTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button onClick={handleChangeTheme} className="absolute right-6">
      {theme === "light" ? <BsFillMoonFill /> : <BsFillSunFill />}
    </button>
  );
};
