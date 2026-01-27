"use client";

import { VscSymbolNamespace } from "react-icons/vsc";
import { MdPassword, MdOutlineClose, MdError } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { FaGoogle } from "react-icons/fa";
import { useState, useEffect, useActionState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

import { login, signInWithGoogle } from "./login";
import { PATHS } from "@/app/_config/routes";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [success, setSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
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
      setShowError(true);
    }
  }, [state?.error]);

  return (
    <div className="bg-gray-900 flex flex-col rounded p-8 gap-y-4">
      <form action={dispatch} className="bg-gray-900 flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-1 w-full">
          <label className="text-xs text-gray-200 ml-1">
            SIGN IN WITH ACCOUNT NAME
          </label>
          <div className="flex flex-row flex-1 gap-x-3 items-center bg-gray-800 px-2 py-1 rounded focus-within:border-sky-900 focus-within:border-2">
            <label htmlFor="username">
              <VscSymbolNamespace size={20} />
            </label>
            <input
              type="text"
              id="username"
              placeholder="Account ID"
              name="username"
              className="text-sm h-full w-full py-1 px-2 outline-none"
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-1 w-full">
          <label className="text-xs text-gray-200 ml-1">ACCOUNT PASSWORD</label>
          <div className="flex flex-row gap-x-3 items-center bg-gray-800 px-2 py-1 rounded focus-within:border-sky-900 focus-within:border-2">
            <label htmlFor="username">
              <MdPassword size={20} />
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              name="password"
              className="text-sm w-full h-full py-1 px-2 outline-none"
            />
          </div>
        </div>
        <button
          disabled={isPending}
          type="submit"
          className="bg-sky-600 rounded py-1.25 font-bold hover:bg-sky-800 mt-4"
        >
          {isPending ? "SINGING IN..." : "LOGIN"}
        </button>
      </form>
      <Link
        href={PATHS.REGISTER}
        className="text-xs text-gray-300 hover:underline hover:underline-offset-4 text-center"
      >
        New to Game Portal ? Register here !
      </Link>

      <div className="flex flex-row items-center gap-4 text-gray-500 text-sm mt-4">
        <div className="h-0 flex flex-1 border-b-gray-500 border-b"></div>
        <p>OR SIGN IN WITH</p>
        <div className="h-0 flex flex-1 border-b-gray-500 border-b"></div>
      </div>

      <form action={signInWithGoogle}>
        <button
          type="submit"
          className="bg-white hover:bg-gray-200 transition-colors rounded w-full py-2 flex flex-row justify-center items-center gap-4 text-black text-sm font-bold"
        >
          <FaGoogle size={15} />
          <p>SIGN IN WITH GOOGLE</p>
        </button>
      </form>

      {success && (
        <div className="flex flex-row items-center gap-x-2 fixed bottom-8 right-8 p-3 px-4 bg-green-900 border-gray-300 border rounded group">
          <TiTick size={24} color={"#DEDEDE"} />
          <p className="mr-5 text-sm">
            Account created successfully! Please Login.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="hover:bg-green-950 rounded-full p-1"
          >
            <MdOutlineClose size={18} color={"#DEDEDE"} />
          </button>
        </div>
      )}
      {state?.error && showError && (
        <div className="flex flex-row items-center gap-x-2 fixed bottom-8 right-8 p-3 px-4 bg-red-900 border-gray-300 border rounded">
          <MdError size={24} color={"#DEDEDE"} />
          <p className="mr-5 text-sm">{state.error}</p>
          <button
            className="hover:bg-red-950 rounded-full p-1"
            onClick={() => setShowError(false)}
          >
            <MdOutlineClose size={18} color={"#DEDEDE"} />
          </button>
        </div>
      )}
    </div>
  );
}
