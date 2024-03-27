"use client";

import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { FC, ReactNode } from "react";

interface PropsType extends LinkProps {
  children: ReactNode;
  margin?: string;
}

const productsRegexp = new RegExp(/\/(place)\/\d{1,}\/(cabinet)\/\d{1,}/)

export const NavLink: FC<PropsType> = ({ children, margin, ...props }) => {
  const { href } = props;
  const pathName = usePathname();  

  const isActive = productsRegexp.test(pathName)
    ? !String(href).includes("/consumable") &&
      pathName.split("/").filter((el) => el)[1] == String(href).split("/")[2]
    : pathName == href;

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
