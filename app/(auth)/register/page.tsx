import RegisterForm from "./RegisterForm";

import { ROUTES } from "@/app/_config/routes";

function GetTitle(path: string) {
  const route = ROUTES.find((r) => r.path === path);
  return route ? route.name : "Game Portal";
}

export const metadata = {
  title: GetTitle("/register"),
};

export default function Register() {
  return (
    <div
      className="flex flex-1 flex-row justify-center items-center w-full h-full"
      style={{
        backgroundImage: "url(/background/login-background.jpg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-screen h-screen bg-linear-to-br from-black/70 to-blue-900/40 fixed top-0 left-0 z-0 backdrop-blur-sm"></div>

      <div className="flex flex-col m-auto w-full max-w-md px-4 sm:px-6 z-10 mt-20 sm:mt-24 max-sm:mt-32">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-zinc-200">
          Welcome to Game Portal!
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm mb-4 sm:mb-6 ml-1">
          Create your account to start your gaming journey
        </p>

        <RegisterForm />
      </div>
    </div>
  );
}
