"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { IoReload } from "react-icons/io5";

interface ViewMoreButtonProps {
  viewMode: string;
  loadMore: number;
  viewType: string;
}

export default function ViewMoreButton({
  viewMode,
  loadMore,
  viewType,
}: ViewMoreButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    const newUrl = `/?view=${viewMode}&loadMore=${loadMore + 1}&viewType=${viewType}`;
    startTransition(() => {
      router.push(newUrl, { scroll: false });
      router.refresh();
    });
  };

  return (
    <div className="flex flex-row items-center w-full">
      <div className="flex flex-1 border-b-2 border-zinc-500 h-1 w-full"></div>
      <button
        onClick={handleClick}
        disabled={isPending}
        className="px-6 py-3 rounded-lg font-bold transition-all text-zinc-400 hover:text-zinc-300 min-w-fit flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending && <IoReload className="animate-spin" size={18} />}
        {isPending ? "Loading..." : "View More Games"}
      </button>
      <div className="flex flex-1 border-b-2 border-zinc-500 h-1 w-full"></div>
    </div>
  );
}
