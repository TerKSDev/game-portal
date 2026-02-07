"use client";

import { VscSymbolNamespace } from "react-icons/vsc";
import { MdPassword, MdOutlineClose, MdError } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { FaGoogle } from "react-icons/fa";
import { useState, useEffect, useActionState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { login, signInWithGoogle } from "./login";
import { PATHS } from "@/app/_config/routes";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [success, setSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorKey, setErrorKey] = useState(0);
  const [state, dispatch, isPending] = useActionState(login, undefined);

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccess(true);
      router.replace(PATHS.LOGIN);
    }
  }, [searchParams]);

  useEffect(() => {
    if (state?.success) {
      window.location.href = PATHS.STORE;
    }
  }, [state?.success]);

  useEffect(() => {
    if (state?.error) {
      setShowError(false);
      setErrorKey((prev) => prev + 1);
      const timer = setTimeout(() => {
        setShowError(true);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <>
      <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 flex flex-col rounded-2xl p-5 sm:p-8 gap-y-3 sm:gap-y-4 shadow-2xl">
        <form action={dispatch} className="flex flex-col gap-y-4 sm:gap-y-6">
          <div className="flex flex-col gap-y-2 w-full">
            <label className="text-xs sm:text-sm font-medium text-zinc-300">
              Account Name
            </label>
            <div className="flex flex-row gap-x-3 items-center bg-zinc-800/50 border border-zinc-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl focus-within:border-zinc-600 focus-within:bg-zinc-800 transition-all duration-200">
              <label htmlFor="username" className="text-zinc-400">
                <VscSymbolNamespace size={18} className="sm:w-5 sm:h-5" />
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter your account name"
                name="username"
                className="text-xs sm:text-sm w-full bg-transparent outline-none placeholder:text-zinc-500"
                key={state?.username}
                defaultValue={state?.username || ""}
              />
            </div>
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <label className="text-xs sm:text-sm font-medium text-zinc-300">
              Password
            </label>
            <div className="flex flex-row gap-x-3 items-center bg-zinc-800/50 border border-zinc-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl focus-within:border-zinc-600 focus-within:bg-zinc-800 transition-all duration-200">
              <label htmlFor="password" className="text-zinc-400">
                <MdPassword size={18} className="sm:w-5 sm:h-5" />
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                name="password"
                className="text-xs sm:text-sm w-full bg-transparent outline-none placeholder:text-zinc-500"
              />
            </div>
          </div>
          <button
            disabled={isPending}
            type="submit"
            className="bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-zinc-700 disabled:to-zinc-600 rounded-xl py-2.5 font-bold transition-all duration-300 shadow-lg hover:shadow-blue-500/50 disabled:shadow-none disabled:cursor-not-allowed mt-2"
          >
            {isPending ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <div className="text-center">
          <span className="text-sm text-zinc-400">New to Game Portal? </span>
          <Link
            href={PATHS.REGISTER}
            className="text-sm text-zinc-300 hover:text-zinc-200 font-medium transition-colors"
          >
            Create an account
          </Link>
        </div>

        <div className="flex flex-row items-center gap-4 text-zinc-500 text-sm mt-2">
          <div className="h-px flex flex-1 bg-linear-to-r from-transparent via-zinc-600 to-transparent"></div>
          <p className="text-xs">OR CONTINUE WITH</p>
          <div className="h-px flex flex-1 bg-linear-to-r from-transparent via-zinc-600 to-transparent"></div>
        </div>

        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="group flex items-center justify-center gap-3 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-medium border border-gray-300 rounded-xl px-5 py-2.5 transition-all duration-200 ease-in-out shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 w-full"
          >
            <Image
              src="https://authjs.dev/img/providers/google.svg"
              alt="Google G Logo"
              width={20}
              height={20}
              className="object-contain"
            />
            <p>Sign in with Google</p>
          </button>
        </form>
      </div>

      {success && (
        <div className="flex flex-row items-center gap-x-3 fixed bottom-6 right-6 max-sm:bottom-4 max-sm:right-4 max-sm:left-4 p-4 px-5 bg-linear-to-r from-green-600 to-emerald-600 border border-green-500/50 rounded-xl shadow-2xl shadow-green-500/30 animate-slide-in z-50">
          <div className="bg-white/20 rounded-full p-1">
            <TiTick size={20} color={"#FFFFFF"} />
          </div>
          <p className="mr-4 text-sm font-medium">
            Account created successfully! Please sign in.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="hover:bg-white/20 rounded-full p-1.5 transition-colors"
          >
            <MdOutlineClose size={16} color={"#FFFFFF"} />
          </button>
        </div>
      )}
      {state?.error && showError && (
        <div
          key={errorKey}
          className="flex flex-row items-center gap-x-3 fixed bottom-6 right-6 max-sm:bottom-4 max-sm:right-4 max-sm:left-4 p-4 px-5 bg-linear-to-r from-red-600 to-rose-600 border border-red-500/50 rounded-xl shadow-2xl shadow-red-500/30 animate-slide-in z-50"
        >
          <div className="bg-white/20 rounded-full p-1">
            <MdError size={20} color={"#FFFFFF"} />
          </div>
          <p className="mr-4 text-sm font-medium">{state.error}</p>
          <button
            className="hover:bg-white/20 rounded-full p-1.5 transition-colors"
            onClick={() => setShowError(false)}
          >
            <MdOutlineClose size={16} color={"#FFFFFF"} />
          </button>
        </div>
      )}
    </>
  );
}
