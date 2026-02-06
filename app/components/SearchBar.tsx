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

  if (pathname === PATHS.TOP_UP) {
    return null;
  }

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
    searchType === "publisher" ? "Search by publisher..." : "Search games...";

  return (
    <div className="flex flex-1 h-full items-center lg:max-w-124">
      <div className="flex flex-row w-full h-fit bg-gray-800/80 backdrop-blur-sm rounded-lg items-center border border-gray-700 focus-within:border-blue-500 focus-within:shadow-lg focus-within:shadow-blue-500/20 transition-all duration-300">
        {/* Custom Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2.5 border-r border-gray-700 text-xs sm:text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200 group"
          >
            <currentOption.icon
              size={16}
              className="text-blue-400 group-hover:text-blue-300 transition-colors sm:block hidden"
            />
            <span className="font-medium hidden sm:inline">
              {currentOption.label}
            </span>
            <span className="font-medium sm:hidden">
              {currentOption.value === "name" ? "Name" : "Pub"}
            </span>
            <IoMdArrowDropdown
              size={18}
              className={`text-gray-400 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl shadow-black/50 z-40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {searchOptions.map((option) => {
                const Icon = option.icon;
                const isActive = option.value === searchType;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSearchTypeChange(option.value)}
                    className={`flex items-start gap-3 w-full px-4 py-3 text-left transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600/20 border-l-2 border-blue-500"
                        : "hover:bg-gray-700/50 border-l-2 border-transparent"
                    }`}
                  >
                    <Icon
                      size={20}
                      className={`mt-0.5 ${
                        isActive
                          ? "text-blue-400"
                          : "text-gray-400 group-hover:text-gray-300"
                      }`}
                    />
                    <div className="flex-1">
                      <div
                        className={`text-sm font-medium ${
                          isActive ? "text-white" : "text-gray-200"
                        }`}
                      >
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {option.description}
                      </div>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <IoIosSearch size={18} className="text-gray-400 ml-2 sm:ml-3" />
        <input
          type="text"
          className="flex flex-1 px-2 sm:px-3 py-2.5 text-xs sm:text-sm outline-none bg-transparent placeholder:text-gray-500"
          placeholder={placeholder}
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get("query")?.toString()}
        />
      </div>
    </div>
  );
}
