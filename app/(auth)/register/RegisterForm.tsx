'use client'

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
    const [ error, setError ] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("")

        const formData = new FormData(e.currentTarget);
        const result = await register(formData);

        if (result.error) {
            setError(result.error);
        } else {
            router.push(`${PATHS.LOGIN}?registered=true`);
        }
    }

    return (
        <div className="bg-gray-900 flex flex-col rounded p-8 gap-y-4">
            <form onSubmit={ handleSubmit } className="flex flex-col gap-y-8">
                <div className="flex flex-col gap-y-1 w-full">
                    <label className="text-xs text-gray-200 ml-1">PLEASE ENTER YOUR ACCOUNT NAME</label>
                    <div className="flex flex-row flex-1 gap-x-3 items-center bg-gray-800 px-2 py-1 rounded focus-within:border-sky-900 focus-within:border-2">
                        <label htmlFor="username"><VscSymbolNamespace size={ 20 } /></label>
                        <input type="text" id="username" name='accountName' placeholder="Account ID" className="text-sm h-full w-full py-1 px-2 outline-none" />
                    </div>
                </div>
                <div className="flex flex-col gap-y-1 w-full">
                    <label className="text-xs text-gray-200 ml-1">PLEASE ENTER YOUR ACCOUNT PASSWORD</label>
                    <div className="flex flex-row gap-x-3 items-center bg-gray-800 px-2 py-1 rounded focus-within:border-sky-900 focus-within:border-2">
                        <label htmlFor="username"><MdPassword size={ 20 } /></label>
                        <input type="password" id="password" name='accountPassword' placeholder="Password" className="text-sm w-full h-full py-1 px-2 outline-none" />
                    </div>
                </div>
                <div className="flex flex-col gap-y-1 w-full">
                    <label className="text-xs text-gray-200 ml-1">PLEASE ENTER YOUR ACCOUNT PASSWORD AGAIN TO CONFIRM YOUR PASSWORD</label>
                    <div className="flex flex-row gap-x-3 items-center bg-gray-800 px-2 py-1 rounded focus-within:border-sky-900 focus-within:border-2">
                        <label htmlFor="username"><MdPassword size={ 20 } /></label>
                        <input type="password" id="password" name="checkPassword" placeholder="Password" className="text-sm w-full h-full py-1 px-2 outline-none" />
                    </div>
                </div>
                <button type="submit" className="bg-sky-600 rounded py-1.25 font-bold hover:bg-sky-800 mt-4">REGISTER</button>
            </form>
            <Link
                href={ PATHS.LOGIN }
                className="text-xs text-gray-300 hover:underline hover:underline-offset-4 text-center"
            >
                Have an account ? Login here !
            </Link>
            { error && (
                <div className="flex flex-row items-center gap-x-2 fixed bottom-8 right-8 p-3 px-4 bg-red-900 border-gray-300 border rounded">
                    <MdError size={ 24 } color={ '#DEDEDE' } />
                    <p className="mr-5 text-sm">{ error }</p>
                    <button onClick={ () => setError('') } className="hover:bg-red-950 rounded-full p-1">
                        <MdOutlineClose size={ 18 } color={ '#DEDEDE' } />
                    </button>
                </div>
            ) }
        </div>
    );
}