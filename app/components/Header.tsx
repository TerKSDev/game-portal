'use client'

import { IoGameController } from "react-icons/io5";
import { IoMdMenu } from "react-icons/io";
import { useState } from "react"

import Navigator from "./Navigator";
import SideBar from "./SideBar"
import SearchBar from "./SearchBar";

export default function Header() {
    const [ showSideBar, setShowSideBar ] = useState(false)

    return (
        <header key='' className='fixed flex flex-row justify-between items-center w-full bg-gray-900 p-3 px-8 h-24 max-lg:gap-x-8 lg:gap-x-16 z-10 shadow-gray-950 shadow-[0_5px_10px] box-border'>
            <div className="flex flex-row gap-x-20 items-center max-md:gap-x-8">
                <button onClick={ () => setShowSideBar(true) } className="hover:bg-gray-700 rounded-lg p-1 md:hidden"><IoMdMenu size={ 26 } /></button>
                <div className='flex flex-row font-mono font-bold items-end gap-x-3 cursor-pointer max-lg:hidden text-nowrap'>
                    <IoGameController size={ 44 } />
                    <h1 className='tracking-wider text-shadow-white text-shadow-[0px_3px_5px] text-2xl mb-0.5'>GAME PORTAL</h1>
                </div>

                <Navigator />

                { showSideBar && (
                    <div className="fixed top-0 left-0 flex flex-row">
                        <SideBar />

                        <div className="bg-black z-20 w-screen h-screen opacity-35" onClick={ () => setShowSideBar(false) }></div>
                    </div>
                ) }
            </div>

            <SearchBar />
        </header>
    );
}