"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  IoFunnelOutline,
  IoCalendarOutline,
  IoTrendingUpOutline,
  IoPricetagOutline,
  IoClose,
} from "react-icons/io5";
import { MdCategory } from "react-icons/md";

const GENRES = [
  { id: "4", name: "Action" },
  { id: "51", name: "Indie" },
  { id: "3", name: "Adventure" },
  { id: "5", name: "RPG" },
  { id: "10", name: "Strategy" },
  { id: "2", name: "Shooter" },
  { id: "40", name: "Casual" },
  { id: "14", name: "Simulation" },
  { id: "7", name: "Puzzle" },
  { id: "11", name: "Arcade" },
  { id: "83", name: "Platformer" },
  { id: "1", name: "Racing" },
  { id: "59", name: "Massively Multiplayer" },
  { id: "15", name: "Sports" },
  { id: "6", name: "Fighting" },
];

const PLATFORMS = [
  { id: "4", name: "PC" },
  { id: "187", name: "PlayStation 5" },
  { id: "1", name: "Xbox One" },
  { id: "7", name: "Nintendo Switch" },
  { id: "18", name: "PlayStation 4" },
  { id: "186", name: "Xbox Series X" },
];

const ORDERING_OPTIONS = [
  { value: "-rating", label: "Best Rated (Recommended)" },
  { value: "-metacritic", label: "Metacritic (Highest)" },
  { value: "-added", label: "Most Popular" },
  { value: "-released", label: "Release Date (Newest)" },
  { value: "released", label: "Release Date (Oldest)" },
  { value: "rating", label: "Rating (Lowest)" },
  { value: "metacritic", label: "Metacritic (Lowest)" },
  { value: "name", label: "Name (A-Z)" },
  { value: "-name", label: "Name (Z-A)" },
];

export default function GameFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const currentGenres = searchParams.get("genres")?.split(",") || [];
  const currentPlatforms = searchParams.get("platforms")?.split(",") || [];
  const currentOrdering = searchParams.get("ordering") || "-added";
  const currentDates = searchParams.get("dates") || "";
  const currentStores = searchParams.get("stores") || "";

  // 检测是否在View More模式（trending, top-rated等）
  const viewMode = searchParams.get("view");
  const isViewMode = Boolean(viewMode);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const toggleGenre = (genreId: string) => {
    const genres = currentGenres.includes(genreId)
      ? currentGenres.filter((g) => g !== genreId)
      : [...currentGenres, genreId];
    updateFilters("genres", genres.join(","));
  };

  const togglePlatform = (platformId: string) => {
    const platforms = currentPlatforms.includes(platformId)
      ? currentPlatforms.filter((p) => p !== platformId)
      : [...currentPlatforms, platformId];
    updateFilters("platforms", platforms.join(","));
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("genres");
    params.delete("platforms");
    // Only clear ordering in search mode, not in view mode
    if (!isViewMode) {
      params.delete("ordering");
    }
    params.delete("dates");
    params.delete("stores");
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const activeFiltersCount =
    currentGenres.length +
    currentPlatforms.length +
    (currentDates ? 1 : 0) +
    (currentStores ? 1 : 0);

  return (
    <div className="relative" ref={filterRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-6 h-full bg-zinc-900 hover:bg-zinc-900/50 border border-zinc-700/50 text-zinc-300 rounded-lg font-bold transition-all"
      >
        <IoFunnelOutline size={16} />
        <span className="hidden sm:inline text-sm">
          {isViewMode ? "Filters" : "Filters & Sort"}
        </span>
        <span className="sm:hidden">Filter</span>
        {activeFiltersCount > 0 && (
          <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed sm:absolute top-0 sm:top-full left-0 sm:left-auto right-0 sm:right-0 sm:mt-2 w-full sm:w-96 bg-zinc-900/95 backdrop-blur-md border-0 sm:border border-zinc-800/80 sm:rounded-xl shadow-2xl shadow-black/50 z-50 h-screen sm:h-auto sm:max-h-[600px] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800/80 p-4 flex items-center justify-between z-10">
            <h3 className="text-lg font-bold text-white">
              {isViewMode ? "Filters" : "Filters & Sort"}
            </h3>
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <IoClose size={18} />
                  <span className="hidden sm:inline">Clear All</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="sm:hidden p-1 hover:bg-zinc-800 rounded-lg"
              >
                <IoClose size={24} className="text-zinc-400" />
              </button>
            </div>
          </div>

          {/* Sort - Only show in search mode */}
          {!isViewMode && (
            <div className="p-4 border-b border-zinc-800/80">
              <div className="flex items-center gap-2 mb-3">
                <IoTrendingUpOutline size={18} className="text-blue-400" />
                <h4 className="font-semibold text-white">Sort By</h4>
              </div>
              <select
                value={currentOrdering}
                onChange={(e) => updateFilters("ordering", e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700/50 rounded-lg text-white text-sm outline-none focus:border-blue-500 transition-colors"
              >
                {ORDERING_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* ViewMode Sorting Notice */}
          {isViewMode && (
            <div className="p-4 border-b border-zinc-800/80">
              <div className="flex items-center gap-2 p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                <IoTrendingUpOutline
                  size={16}
                  className="text-blue-400 shrink-0"
                />
                <p className="text-xs text-zinc-400">
                  Sorting is fixed for this category. Use filters below to
                  refine results.
                </p>
              </div>
            </div>
          )}

          {/* Date Range */}
          <div className="p-4 border-b border-zinc-800/80">
            <div className="flex items-center gap-2 mb-3">
              <IoCalendarOutline size={18} className="text-blue-400" />
              <h4 className="font-semibold text-white">Release Date</h4>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => updateFilters("dates", "2024-01-01,2026-12-31")}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentDates === "2024-01-01,2026-12-31"
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                Last 2 Years
              </button>
              <button
                onClick={() => updateFilters("dates", "2023-01-01,2023-12-31")}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentDates === "2023-01-01,2023-12-31"
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                2023
              </button>
              <button
                onClick={() => updateFilters("dates", "2022-01-01,2022-12-31")}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentDates === "2022-01-01,2022-12-31"
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                2022
              </button>
              {currentDates && (
                <button
                  onClick={() => updateFilters("dates", "")}
                  className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-all"
                >
                  Clear Date Filter
                </button>
              )}
            </div>
          </div>

          {/* Genres */}
          <div className="p-4 border-b border-zinc-800/80">
            <div className="flex items-center gap-2 mb-3">
              <MdCategory size={18} className="text-blue-400" />
              <h4 className="font-semibold text-white">Genres</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => toggleGenre(genre.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    currentGenres.includes(genre.id)
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          {/* Platforms */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <IoPricetagOutline size={18} className="text-blue-400" />
              <h4 className="font-semibold text-white">Platforms</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    currentPlatforms.includes(platform.id)
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  {platform.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
