import AuthForm from "@/features/auth/AuthForm";
import { db } from "@/shared";

export default async function SignIn() {
  const users = await db.user.findMany({
    where: {
      id: {
        not: 1,
      },
    },
  });

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          src="/logo.png"
          className="mx-auto w-auto"
          height={134}
          width={134}
          alt="logo"
        />
      </div>
      <AuthForm users={users} />
    </div>
  );
}
