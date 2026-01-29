"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { IoIosSearch } from "react-icons/io";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);

  return (
    <div className="flex flex-1 h-full items-center lg:max-w-124">
      <div className="flex flex-row w-full h-fit bg-gray-800/80 backdrop-blur-sm rounded-lg items-center pl-4 border border-gray-700 focus-within:border-blue-500 focus-within:shadow-lg focus-within:shadow-blue-500/20 transition-all duration-300">
        <IoIosSearch size={20} className="text-gray-400" />
        <input
          type="text"
          className="flex flex-1 px-3 py-2.5 text-sm outline-none bg-transparent placeholder:text-gray-500"
          placeholder="Search games..."
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get("query")?.toString()}
        />
      </div>
    </div>
  );
}
