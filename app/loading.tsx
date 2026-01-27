import Image from "next/image"

export default function Loading() {
    return (
        <div className="fixed top-0 left-0 z-50 flex items-center w-full h-screen justify-center bg-black opacity-50">
            <Image
                src='/loading-animation.gif'
                alt="Loading..."
                width={ 100 }
                height={ 100 }
                unoptimized={ true }
            />
        </div>
    )
}