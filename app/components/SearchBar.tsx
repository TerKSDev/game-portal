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
      <div className="flex flex-row w-full h-fit bg-gray-700 rounded items-center pl-3 border-2 border-transparent focus-within:border-sky-800 transition-colors">
        <IoIosSearch size={18} />
        <input
          type="text"
          className="flex flex-1 px-3 py-2 text-sm outline-none bg-transparent"
          placeholder="Search in store..."
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get("query")?.toString()}
        />
      </div>
    </div>
  );
}
