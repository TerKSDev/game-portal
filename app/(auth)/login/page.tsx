import Header from "@/app/components/Header";
import LoginForm from "./LoginForm";
import { Suspense } from "react";

import { ROUTES } from "@/app/_config/routes";

function GetTitle(path: string) {
  const route = ROUTES.find((r) => r.path === path);
  return route ? route.name : "Game Portal";
}

export const metadata = {
  title: GetTitle("/login"),
};

export default function Login() {
  return (
    <div
      className="flex flex-1 w-screen h-screen"
      style={{
        backgroundImage: "url(/background/login-background.jpg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-screen h-screen bg-linear-to-br from-black/70 to-blue-900/40 fixed top-0 left-0 z-0 backdrop-blur-sm"></div>

      <div className="flex flex-col m-auto w-full max-w-md px-4 sm:px-6 z-10 mt-20 sm:mt-32 max-sm:mt-32">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Welcome Back!
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6 ml-0.5">
          Sign in to continue your gaming adventure
        </p>

        <Suspense
          fallback={
            <div className="bg-gray-900 flex flex-col rounded p-8 gap-y-4 min-h-96" />
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
