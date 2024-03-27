"use client";

import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { FC, ReactNode } from "react";

interface PropsType extends LinkProps {
  children: ReactNode;
  margin?: string;
}

export const NavLink: FC<PropsType> = ({ children, margin, ...props }) => {
  const { href } = props;
  const pathName = usePathname();  
  const isActive = pathName.includes(String(href))
  

  return (
    <Link
      {...props}
      className={clsx(
        "text-white p-4 rounded-md w-full uppercase pl-7",
        isActive ? "bg-light-primary" : "bg-primary"
      )}
      style={{
        margin,
      }}
    >
      {children}
    </Link>
  );
};
