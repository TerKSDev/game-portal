"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { IoIosSearch } from "react-icons/io";
import { IoGameController, IoBusinessSharp } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
import { useState, useEffect, useRef } from "react";
import { PATHS } from "@/app/_config/routes";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [searchType, setSearchType] = useState<"name" | "publisher">(
    (searchParams.get("searchType") as "name" | "publisher") || "name",
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const type = searchParams.get("searchType") as "name" | "publisher";
    if (type && type !== searchType) {
      setSearchType(type);
    }
  }, [searchParams, searchType]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
      params.set("searchType", searchType);
    } else {
      params.delete("query");
      params.delete("searchType");
    }

    const targetPath = pathname === PATHS.STORE ? PATHS.STORE : PATHS.STORE;
    replace(`${targetPath}?${params.toString()}`, { scroll: false });
  }, 300);

  // Move early return AFTER all hooks
  if (pathname === PATHS.TOP_UP) {
    return null;
  }

  const handleSearchTypeChange = (type: "name" | "publisher") => {
    setSearchType(type);
    setIsDropdownOpen(false);
    const params = new URLSearchParams(searchParams);
    const currentQuery = searchParams.get("query");

    params.set("searchType", type);
    if (currentQuery) {
      params.set("query", currentQuery);
    }

    // 如果有搜索内容且不在 store 页面，跳转到 store 页面
    const targetPath =
      currentQuery && pathname !== PATHS.STORE ? PATHS.STORE : pathname;
    replace(`${targetPath}?${params.toString()}`, { scroll: false });
  };

  const searchOptions = [
    {
      value: "name" as const,
      label: "Game Name",
      icon: IoGameController,
      description: "Search by title",
    },
    {
      value: "publisher" as const,
      label: "Publisher",
      icon: IoBusinessSharp,
      description: "Search by company",
    },
  ];

  const currentOption = searchOptions.find((opt) => opt.value === searchType)!;
  const placeholder =
    searchType === "publisher" ? "Search publishers..." : "Search games...";

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
          placeholder={placeholder}
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get("query")?.toString()}
        />
      </div>
    </div>
  );
}
