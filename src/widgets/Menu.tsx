"use client";

import { MenuContext } from "@/app/Provider";
import { IPlace } from "@/entities/place/lib/types";
import { UserProfile } from "@/entities/user/ui/UserProfile";
import { LogoutButton } from "@/features/auth/LogoutButton";
import { useWindowSize } from "@/shared/lib/hooks/useWindowSize";
import { NavLink } from "@/shared/ui/NavLink";
import { User } from "next-auth";
import { FC, useContext } from "react";

type PropsType = {
  places: IPlace[];
  user: User;
};

export const Menu: FC<PropsType> = ({ places, user }) => {
  const { isOpenedMenu, handleMenu } = useContext(MenuContext);
  const { width } = useWindowSize();

  if (!isOpenedMenu) return null;

  return (
    <>
      {width && width <= 1400 && (
        <div
          className="w-full h-[100dvh] bg-black/20 fixed z-20"
          onClick={handleMenu}
        />
      )}

      <aside
        className="fixed overflow-auto m-0 w-[286px] text-white h-[100dvh] bg-primary flex items-center flex-col 2xl:static z-30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex justify-around items-center p-5 h-[88px] shadow-md">
          <h1 className="uppercase font-bold text-2xl">Inventory</h1>
        </div>
        <ul className="px-1 flex flex-col items-center mt-2 w-full overflow-y-auto pb-20">
          <NavLink
            href={"/"}
            onClick={() => {
              width && width <= 1400 && handleMenu();
            }}
          >
            Статистика
          </NavLink>
          <NavLink
            href={"/consumable/1"}
            onClick={() => {
              width && width <= 1400 && handleMenu();
            }}
          >
            Расходники
          </NavLink>
          <NavLink
            href={"/orders"}
            onClick={() => {
              width && width <= 1400 && handleMenu();
            }}
          >
            Заказы
          </NavLink>
          {places.map((place) => (
            <NavLink
              href={`/place/${place.id}`}
              key={place.id}
              onClick={() => {
                width && width <= 1400 && handleMenu();
              }}
            >
              {place.name}
            </NavLink>
          ))}
        </ul>

        {width && width <= 640 && (
          <div className="absolute bottom-0 w-full bg-light-primary p-5">
            <UserProfile logoutButton={<LogoutButton />} user={user} />
          </div>
        )}
      </aside>
    </>
  );
};
