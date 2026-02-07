"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { IoIosSearch } from "react-icons/io";
import {
  IoClose,
  IoFunnelOutline,
  IoTrendingUpOutline,
  IoCalendarOutline,
} from "react-icons/io5";
import { MdSortByAlpha } from "react-icons/md";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const SORT_OPTIONS = [
  { value: "name-asc", label: "Name (A-Z)", icon: MdSortByAlpha },
  { value: "name-desc", label: "Name (Z-A)", icon: MdSortByAlpha },
  {
    value: "purchasedAt-desc",
    label: "Purchase Date (Newest)",
    icon: IoCalendarOutline,
  },
  {
    value: "purchasedAt-asc",
    label: "Purchase Date (Oldest)",
    icon: IoCalendarOutline,
  },
];

export default function LibrarySearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const filterRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [searchValue, setSearchValue] = useState(
    searchParams.get("query")?.toString() || "",
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const currentSort = searchParams.get("sort") || "purchasedAt-desc";
  const currentDateFilter = searchParams.get("dateFilter") || "";

  const hasActiveFilters = !!currentDateFilter;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isFilterOpen]);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    params.delete("id");
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);

  const handleClear = () => {
    setSearchValue("");
    const params = new URLSearchParams(searchParams);
    params.delete("query");
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams);
    if (sortValue) {
      params.set("sort", sortValue);
    } else {
      params.delete("sort");
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
    setIsFilterOpen(false);
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("dateFilter");
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-row justify-center w-full">
      <div className="flex gap-2 relative w-full">
        <div className="relative flex flex-1 items-center bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-zinc-700 focus-within:border-blue-500 focus-within:shadow-lg focus-within:shadow-blue-500/20 transition-all duration-300">
          <IoIosSearch size={18} className="text-zinc-400 ml-3" />
          <input
            type="text"
            className="flex flex-1 px-3 py-2.5 text-sm outline-none bg-transparent placeholder:text-zinc-500 text-white"
            placeholder="Search your library..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              handleSearch(e.target.value);
            }}
          />
          <button
            onClick={handleClear}
            className={`absolute right-3 p-1 hover:bg-zinc-700 rounded-full transition-all ${
              searchValue
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
            aria-label="Clear search"
          >
            <IoClose size={18} className="text-zinc-400 hover:text-white" />
          </button>
        </div>

        {/* Filter Button */}
        <div className="shrink-0">
          <button
            ref={buttonRef}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 bg-zinc-800/80 backdrop-blur-sm border rounded-xl hover:shadow-lg transition-all duration-300 ${
              hasActiveFilters
                ? "border-blue-500 text-blue-400 hover:border-blue-400 hover:shadow-blue-500/20"
                : "border-zinc-700 text-zinc-300 hover:text-white hover:border-blue-500 hover:shadow-blue-500/20"
            }`}
            aria-label="Filter and sort"
          >
            <IoFunnelOutline size={20} />
          </button>

          {/* Filter Dropdown - Render via Portal */}
          {isMounted &&
            isFilterOpen &&
            createPortal(
              <>
                {/* Backdrop for mobile */}
                <div
                  className="fixed inset-0 bg-black/50 z-9998 sm:hidden"
                  onClick={() => setIsFilterOpen(false)}
                />
                <div
                  ref={filterRef}
                  className="fixed sm:absolute left-0 right-0 top-20 sm:top-full sm:left-auto sm:right-auto w-full sm:w-72 bg-zinc-800/95 backdrop-blur-md border-0 sm:border border-zinc-700 sm:rounded-xl shadow-2xl shadow-black/50 z-9999 h-[calc(100vh-5rem)] sm:h-auto sm:max-h-96 overflow-y-auto"
                  style={
                    buttonRef.current && typeof window !== "undefined"
                      ? {
                          right:
                            window.innerWidth >= 640
                              ? `${window.innerWidth - buttonRef.current.getBoundingClientRect().right}px`
                              : undefined,
                          top:
                            window.innerWidth >= 640
                              ? `${buttonRef.current.getBoundingClientRect().bottom + 8}px`
                              : undefined,
                        }
                      : {}
                  }
                >
                  {/* Header */}
                  <div className="sticky top-0 bg-zinc-800/95 backdrop-blur-md border-b border-zinc-700 p-3 sm:p-3 flex items-center justify-between z-10">
                    <h3 className="text-sm font-bold text-white">
                      Sort & Filter
                    </h3>
                    <div className="flex items-center gap-2">
                      {hasActiveFilters && (
                        <button
                          onClick={clearAllFilters}
                          className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                          <IoClose size={16} />
                          Clear
                        </button>
                      )}
                      <button
                        onClick={() => setIsFilterOpen(false)}
                        className="p-1 hover:bg-zinc-700 rounded-lg"
                      >
                        <IoClose size={20} className="text-zinc-400" />
                      </button>
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div className="p-3 border-b border-zinc-700">
                    <div className="flex items-center gap-2 mb-2">
                      <IoTrendingUpOutline
                        size={16}
                        className="text-blue-400"
                      />
                      <h4 className="font-semibold text-white text-sm">
                        Sort By
                      </h4>
                    </div>
                    <div className="space-y-1">
                      {SORT_OPTIONS.map((option) => {
                        const Icon = option.icon;
                        const isActive = currentSort === option.value;
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleSortChange(option.value)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                              isActive
                                ? "bg-blue-600 text-white"
                                : "bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700"
                            }`}
                          >
                            <Icon size={16} />
                            <span>{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Date Filter */}
                  <div className="p-3 border-b border-zinc-700">
                    <div className="flex items-center gap-2 mb-2">
                      <IoCalendarOutline size={16} className="text-blue-400" />
                      <h4 className="font-semibold text-white text-sm">
                        Purchase Date
                      </h4>
                    </div>
                    <div className="space-y-1">
                      <button
                        onClick={() => handleFilterChange("dateFilter", "week")}
                        className={`w-full px-3 py-2 rounded-lg text-sm transition-all ${
                          currentDateFilter === "week"
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700"
                        }`}
                      >
                        Last Week
                      </button>
                      <button
                        onClick={() =>
                          handleFilterChange("dateFilter", "month")
                        }
                        className={`w-full px-3 py-2 rounded-lg text-sm transition-all ${
                          currentDateFilter === "month"
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700"
                        }`}
                      >
                        Last Month
                      </button>
                      <button
                        onClick={() =>
                          handleFilterChange("dateFilter", "3months")
                        }
                        className={`w-full px-3 py-2 rounded-lg text-sm transition-all ${
                          currentDateFilter === "3months"
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700"
                        }`}
                      >
                        Last 3 Months
                      </button>
                      <button
                        onClick={() => handleFilterChange("dateFilter", "year")}
                        className={`w-full px-3 py-2 rounded-lg text-sm transition-all ${
                          currentDateFilter === "year"
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700"
                        }`}
                      >
                        Last Year
                      </button>
                      {currentDateFilter && (
                        <button
                          onClick={() => handleFilterChange("dateFilter", "")}
                          className="w-full px-3 py-2 rounded-lg text-sm bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700 transition-all"
                        >
                          Clear Date Filter
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>,
              document.body,
            )}
        </div>
      </div>
    </div>
  );
}
