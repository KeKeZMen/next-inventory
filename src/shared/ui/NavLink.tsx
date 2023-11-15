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
  const isActive = pathName === href;

  return (
    <Link
      {...props}
      className={clsx(
        "text-white p-7 rounded-md w-full uppercase",
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
