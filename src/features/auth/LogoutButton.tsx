"use client";

import { signOut } from "next-auth/react";

export const LogoutButton = () => {
  return (
    <button
      onClick={() => signOut()}
      className="h-6 w-6 bg-no-repeat bg-center bg-logout"
    />
  );
};
