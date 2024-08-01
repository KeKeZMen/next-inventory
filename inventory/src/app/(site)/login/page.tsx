import AuthForm from "@/features/auth/AuthForm";

export default function SignIn() {
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
      <AuthForm />
    </div>
  );
}
