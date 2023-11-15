import { createHash } from "crypto";
import NextAuth, { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/shared";

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

        return {
          rightId: user.rightId,
          id: user.id,
          name: user.name,
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
          const {
            name,
            id,
            productActions,
            cabinetActions,
            ...enabledActions
          } = right;
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
