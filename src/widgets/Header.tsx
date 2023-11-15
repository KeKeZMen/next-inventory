"use client";

import { MenuContext } from "@/app/Provider";
import { UserProfile } from "@/entities/user/ui/UserProfile";
import { LogoutButton } from "@/features/auth/LogoutButton";
import { SearchInput } from "@/features/search/SearchInput";
import { useWindowSize } from "@/shared/lib/hooks/useWindowSize";
import { BurgerButton } from "@/shared/ui/Burger";
import { User } from "next-auth";
import { FC, useContext } from "react";

type PropsType = {
  user: User;
  isNoAdmin?: boolean;
};

export const Header: FC<PropsType> = ({ user, isNoAdmin }) => {
  const { handleMenu } = useContext(MenuContext);
  const { width } = useWindowSize();

  return (
    <header className="p-6 shadow-md bg-primary fixed w-full z-10 sm:static sm:min-h-[88px]">
      <div className="flex justify-between items-center text-white">
        <div className="flex justify-between items-center w-full md:w-[40%]">
          {!isNoAdmin && (
            <>
              <BurgerButton onClick={handleMenu} />
              <SearchInput />
            </>
          )}
        </div>

        {width && width >= 640 && (
          <UserProfile logoutButton={<LogoutButton />} user={user} />
        )}
      </div>
    </header>
  );
};
