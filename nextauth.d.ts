import { DefaultSession, DefaultUser } from "next-auth";

interface IUser extends DefaultUser {
  rightId: number;
}

declare module "next-auth" {
  interface User extends IUser {
    id: number;
  }
  interface Session {
    user?: User;
    isAdmin?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT extends IUser {
    id: number;
  }
}
