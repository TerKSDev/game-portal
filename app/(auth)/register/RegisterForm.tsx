"use client";

import { VscSymbolNamespace, VscError } from "react-icons/vsc";
import { MdError } from "react-icons/md";
import { MdPassword, MdOutlineClose } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { register } from "./register";
import { PATHS } from "@/app/_config/routes";

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [errorKey, setErrorKey] = useState(0);
  const [accountName, setAccountName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await register(formData);

    if (result.error) {
      setErrorKey((prev) => prev + 1);
      setAccountName(result.accountName || "");
      setTimeout(() => {
        setError(result.error);
      }, 10);
    } else {
      router.push(`${PATHS.LOGIN}?registered=true`);
    }
  };

  return (
    <>
      <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700/50 flex flex-col rounded-xl p-8 gap-y-4 shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
          <div className="flex flex-col gap-y-2 w-full">
            <label className="text-sm font-medium text-gray-300">
              Account Name
            </label>
            <div className="flex flex-row gap-x-3 items-center bg-gray-800/50 border border-gray-700 px-4 py-3 rounded-lg focus-within:border-blue-500 focus-within:bg-gray-800 transition-all duration-200">
              <label htmlFor="username" className="text-gray-400">
                <VscSymbolNamespace size={20} />
              </label>
              <input
                type="text"
                id="username"
                name="accountName"
                placeholder="Choose your account name"
                className="text-sm w-full bg-transparent outline-none placeholder:text-gray-500"
                key={accountName}
                defaultValue={accountName}
              />
            </div>
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <label className="text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="flex flex-row gap-x-3 items-center bg-gray-800/50 border border-gray-700 px-4 py-3 rounded-lg focus-within:border-blue-500 focus-within:bg-gray-800 transition-all duration-200">
              <label htmlFor="password" className="text-gray-400">
                <MdPassword size={20} />
              </label>
              <input
                type="password"
                id="password"
                name="accountPassword"
                placeholder="Create a strong password"
                className="text-sm w-full bg-transparent outline-none placeholder:text-gray-500"
              />
            </div>
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            <label className="text-sm font-medium text-gray-300">
              Confirm Password
            </label>
            <div className="flex flex-row gap-x-3 items-center bg-gray-800/50 border border-gray-700 px-4 py-3 rounded-lg focus-within:border-blue-500 focus-within:bg-gray-800 transition-all duration-200">
              <label htmlFor="confirmPassword" className="text-gray-400">
                <MdPassword size={20} />
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="checkPassword"
                placeholder="Re-enter your password"
                className="text-sm w-full bg-transparent outline-none placeholder:text-gray-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-lg py-2.5 font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/50 mt-2"
          >
            Create Account
          </button>
        </form>
        <div className="text-center">
          <span className="text-sm text-gray-400">
            Already have an account?{" "}
          </span>
          <Link
            href={PATHS.LOGIN}
            className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>

      {error && (
        <div
          key={errorKey}
          className="flex flex-row items-center gap-x-3 fixed bottom-6 right-6 max-sm:bottom-4 max-sm:right-4 max-sm:left-4 p-4 px-5 bg-gradient-to-r from-red-600 to-rose-600 border border-red-500/50 rounded-lg shadow-2xl shadow-red-500/30 animate-slide-in z-50"
        >
          <div className="bg-white/20 rounded-full p-1">
            <MdError size={20} color={"#FFFFFF"} />
          </div>
          <p className="mr-4 text-sm font-medium">{error}</p>
          <button
            onClick={() => setError("")}
            className="hover:bg-white/20 rounded-full p-1.5 transition-colors"
          >
            <MdOutlineClose size={16} color={"#FFFFFF"} />
          </button>
        </div>
      )}
    </>
  );
}
