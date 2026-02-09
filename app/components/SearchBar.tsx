"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { IoIosSearch } from "react-icons/io";
import { PATHS } from "@/app/_config/routes";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
      params.delete("loadMore"); // Reset loadMore when searching
      params.delete("view"); // Clear view mode when searching
      params.set("viewType", "grid"); // Default to grid view
      // Clear all filters when performing a new search
      params.delete("genres");
      params.delete("platforms");
      params.delete("ordering");
      params.delete("dates");
      params.delete("stores");
    } else {
      params.delete("query");
      params.delete("loadMore");
      params.delete("viewType");
      // Clear all filters when clearing search
      params.delete("genres");
      params.delete("platforms");
      params.delete("ordering");
      params.delete("dates");
      params.delete("stores");
    }

    const targetPath = pathname === PATHS.STORE ? PATHS.STORE : PATHS.STORE;
    replace(`${targetPath}?${params.toString()}`, { scroll: false });
  }, 300);

  // Don't show search bar on top-up page
  if (pathname === PATHS.TOP_UP) {
    return null;
  }

  return (
    <div className="flex flex-1 h-full items-center w-full">
      <div className="flex flex-row w-full h-fit bg-zinc-800/80 backdrop-blur-sm rounded-lg items-center border border-zinc-700/50 focus-within:border-blue-500/50 transition-all duration-200">
        {/* Search Icon */}
        <div className="pl-3 pr-2">
          <IoIosSearch className="text-zinc-400" size={18} />
        </div>

        {/* Search Input */}
        <input
          type="text"
          className="flex flex-1 px-2 py-2.5 text-sm outline-none bg-transparent placeholder:text-zinc-500 text-white"
          placeholder="Search games, publishers, tags..."
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get("query")?.toString()}
        />
      </div>
    </div>
  );
}
