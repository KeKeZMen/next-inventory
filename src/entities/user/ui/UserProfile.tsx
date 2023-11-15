"use client";

import { FC, useContext } from "react";
import { Avatar, useWindowSize } from "@/shared";
import { User } from "next-auth";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { MenuContext } from "@/app/Provider";

type PropsType = {
  user: User;
  logoutButton: JSX.Element;
};

export const UserProfile: FC<PropsType> = ({ user, logoutButton }) => {
  const session = useSession();
  const { width } = useWindowSize();
  const { handleMenu } = useContext(MenuContext);

  return (
    <div className="flex items-center justify-between gap-4">
      {session.data?.isAdmin ? (
        <Link
          href="/admin"
          className="w-10 h-10 bg-no-repeat bg-center"
          style={{ backgroundImage: "url('/gear.svg')" }}
          onClick={() => {
            width && width <= 640 && handleMenu();
          }}
        ></Link>
      ) : (
        <Avatar image={user?.image} />
      )}
      <p>{user.name}</p>
      {logoutButton}
    </div>
  );
};
