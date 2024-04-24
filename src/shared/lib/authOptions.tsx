import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { createHash } from "crypto";
import { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from ".";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        name: { label: "name", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.name || !credentials.password) {
          throw new Error("Invalid Credentials");
        }

        const user = await db.user.findUnique({
          where: {
            name: credentials.name,
          },
        });

        if (
          !user ||
          user.password !==
            createHash("sha256").update(credentials.password).digest("hex")
        ) {
          throw new Error("Invalid Credentials");
        }

        const userPlaces = await db.userPlace.findMany({
          where: {
            userId: user.id,
          },
        });

        return {
          rightId: user.rightId,
          id: user.id,
          name: user.name,
          places: userPlaces.map((p) => String(p.placeId)),
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      user && (token.user = user);
      return token;
    },
    session: async ({ session, token }) => {
      if (token && session.user) {
        const user = token.user as User;

        const right = await db.right.findFirst({
          where: {
            id: user.rightId,
          },
        });

        if (right) {
          const { name, id, ...enabledActions } = right;
          session.isAdmin = Object.values(enabledActions).some((r) => r);
        }

        session.user = user;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};
