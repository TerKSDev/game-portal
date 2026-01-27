import Header from "@/app/components/Header";
import RegisterForm from "./RegisterForm";

import { ROUTES } from "@/app/_config/routes";

function GetTitle(path: string) {
  const route = ROUTES.find(r => r.path === path);
  return route ? route.name : "Game Portal";
}

export const metadata = {
  title: GetTitle('/register'),
}

export default function Register() {
    return (
        <div className="flex flex-1 w-screen h-screen" style={ { backgroundImage: 'url(/background/login-background.jpg)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' } }>
            <div className="w-screen h-screen bg-black opacity-60 fixed top-0 left-0 z-0"></div>

            <div className="flex flex-col m-auto font-mono w-3/4 max-w-150 opacity-95 z-10">
                <h1 className="text-2xl mb-4 ml-1">Welcome To Game Portal !</h1>

                <RegisterForm />
            </div>
        </div>
    );
}