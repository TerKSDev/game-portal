'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FaStar } from "react-icons/fa";

import { GameProps } from '@/lib/game'
import { PATHS } from '@/app/_config/routes'

interface GameCardProps {
    game: GameProps;
}

export default function GameCard({ game }: GameCardProps) {

    return (
        <Link href={ `${PATHS.DETAILS}/${game.id} ` } className='max-md:w-full relative flex flex-col group bg-gray-950 rounded-md border-2 border-gray-300 box-border w-80.75 h-full cursor-pointer'>
            <div className='relative flex w-full overflow-hidden rounded-t-md object-cover aspect-video'>
                { game.background_image ? (
                    <Image
                        src={ game.background_image }
                        fill
                        alt={ game.name }
                        className='border-b-2 border-gray-400 object-cover'
                    />
                ) : (
                    <div className=''>Image Not Found.</div>
                ) }
            </div>

            <div className='flex flex-row justify-between items-start font-mono flex-1 box-border w-full'>
                <div className='flex flex-col justify-between gap-y-8 text-[14px] text-wrap p-4 flex-1 h-full'>
                    <div className='flex flex-row justify-between'>
                        <div className='flex flex-col h-full gap-y-0.75'>
                            <p className='group-hover:underline group-hover:underline-offset-4'>{ game.name }</p>
                            <div className='flex flex-col gap-y-0.5'>
                                <div className='text-[10px] flex flex-row gap-x-1.5 text-gray-400'>
                                    <p>Release:</p>
                                    <p>{ game.released }</p>
                                </div>
                                <div className='text-[10px] flex flex-row gap-x-1.5 text-gray-400'>
                                    <p>Media Rated:</p>
                                    <div className='flex flex-row gap-x-1 items-center'>
                                        <FaStar />
                                        <p>{ game.metacritic }</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-row items-center justify-center text-sm gap-x-1.5 text-yellow-600 font-bold h-fit'>
                            <FaStar />
                            <p>{ game.rating }</p>
                        </div>
                    </div>
                    <div className='flex flex-row gap-2 gap-y-2.5 flex-wrap w-full'>
                        { game.genres.map(genre => {
                            return (
                                <div key={ genre.id } className='text-[12px] bg-gray-700 px-3 p-0.75 rounded-full font-bold'>{ genre.name }</div>
                            );
                        }) }
                    </div>
                </div>
            </div>
        </Link>
    );
}