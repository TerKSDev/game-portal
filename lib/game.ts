"use server";

import axios from "axios";

export interface GamePriceProps {
  original: string;
  final: string;
  discount: number;
  currency: string;
}

export interface GameDetailProps {
  game: {
    id: number;
    name: string;
    description: string;
    background_image: string;
    released: string;
    updated: string;
    metacritic_url: string;
    website: string;
    rating: number;
    genres: {
      id: number;
      name: string;
    }[];
    publishers: {
      id: number;
      name: string;
      image_background: string;
    }[];
  };
  price: GamePriceProps | null;
}

export interface GameProps {
  id: number;
  slug: string;
  name: string;
  background_image: string | null;
  released: string;
  rating: number;
  metacritic: number;

  genres: {
    id: number;
    name: string;
  }[];
}

export interface RAWGResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: GameProps[];
}

export interface GameFilters {
  genres?: string;
  platforms?: string;
  ordering?: string;
  dates?: string;
  stores?: string;
}

export async function GetGames(
  page: number = 1,
  pageSize: number = 24,
  query?: string,
  searchType?: "name" | "publisher",
  filters?: GameFilters,
) {
  const apiKey = process.env.RAWG_API_KEY;
  if (!apiKey) throw new Error("Error: API Key not found.");

  let url = `https://api.rawg.io/api/games?key=${apiKey}&page=${page}&page_size=${pageSize}`;

  if (query) {
    if (searchType === "publisher") {
      // For publisher search, convert to slug format (lowercase with hyphens)
      // e.g., "Nintendo" -> "nintendo", "Electronic Arts" -> "electronic-arts"
      const publisherSlug = query.toLowerCase().replace(/\s+/g, "-");
      url += `&publishers=${encodeURIComponent(publisherSlug)}`;
    } else {
      // Default search by game name
      url += `&search=${encodeURIComponent(query)}`;
    }
  }

  // Apply filters
  if (filters) {
    if (filters.genres) {
      url += `&genres=${encodeURIComponent(filters.genres)}`;
    }
    if (filters.platforms) {
      url += `&platforms=${encodeURIComponent(filters.platforms)}`;
    }
    if (filters.ordering) {
      url += `&ordering=${encodeURIComponent(filters.ordering)}`;
    }
    if (filters.dates) {
      url += `&dates=${encodeURIComponent(filters.dates)}`;
    }
    // If user specifies stores filter, use it; otherwise default to Steam (store ID: 1)
    if (filters.stores) {
      url += `&stores=${encodeURIComponent(filters.stores)}`;
    } else {
      url += `&stores=1`; // Default to Steam only
    }
  } else {
    // No filters provided, default to Steam only
    url += `&stores=1`;
  }

  console.log("[GetGames] URL:", url);
  console.log("[GetGames] Query:", query, "Type:", searchType);
  console.log("[GetGames] Filters:", filters);

  const res = await fetch(url);

  if (!res.ok) {
    console.error("[GetGames] Fetch error:", res.status, res.statusText);
    throw new Error("Error: Failed to fetch games.");
  }

  const data: RAWGResponse = await res.json();
  console.log("[GetGames] Results count:", data.results.length);
  console.log("[GetGames] Total count:", data.count);
  return data.results as GameProps[];
}

export async function GetGamePrice(
  gameName: string,
  stores?: any[],
  websiteUrl?: string,
): Promise<GamePriceProps | null> {
  try {
    // Add timeout to prevent hanging in serverless environment
    const timeout = new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), 5000); // 5 second timeout
    });

    const pricePromise = (async () => {
      let steamAppId: string | null = null;

      if (stores && stores.length > 0) {
        const steamStore = stores.find(
          (s: any) => s.store.slug === "steam" || s.store.id === 1,
        );
        if (steamStore && steamStore.url) {
          const match = steamStore.url.match(/\/app\/(\d+)/);
          if (match) steamAppId = match[1];
        }
      }

      if (!steamAppId) {
        try {
          const searchRes = await axios.get(
            "https://store.steampowered.com/api/storesearch/",
            {
              params: {
                term: gameName,
                l: "english",
                cc: "my",
              },
            },
          );

          if (
            searchRes.data &&
            searchRes.data.items &&
            searchRes.data.items.length > 0
          ) {
            steamAppId = searchRes.data.items[0].id;
          }
        } catch (searchError) {
          console.error("Failed to search Steam:", searchError);
        }
      }

      if (!steamAppId) {
        return null;
      }

      const steamRES = await axios.get(
        `https://store.steampowered.com/api/appdetails`,
        {
          params: {
            appids: steamAppId,
            cc: "my",
          },
        },
      );

      const steamData = steamRES.data;
      const gameDetails = steamData[steamAppId];

      if (!gameDetails || !gameDetails.success) return null;

      if (gameDetails.data.is_free) {
        return {
          original: "Free",
          final: "Free",
          discount: 0,
          currency: "MYR",
        };
      }

      const priceOverview = gameDetails.data.price_overview;
      if (!priceOverview) return null;

      return {
        original: `RM ${(priceOverview.initial / 100).toFixed(2)}`,
        final: `RM ${(priceOverview.final / 100).toFixed(2)}`,
        discount: priceOverview.discount_percent,
        currency: priceOverview.currency,
      };
    })();

    // Race between timeout and actual API call
    return await Promise.race([pricePromise, timeout]);
  } catch (error) {
    console.error("Error in GetGamePrice:", error);
    return null;
  }
}

export async function GetGameDetails(gameId: number | string) {
  const RAWG_API_KEY = process.env.RAWG_API_KEY;

  try {
    const rawgRES = await axios.get(`https://api.rawg.io/api/games/${gameId}`, {
      params: {
        key: RAWG_API_KEY,
      },
    });

    const getPrice = await GetGamePrice(
      rawgRES.data.name,
      rawgRES.data.stores || [],
      rawgRES.data.website,
    );

    const gameData = {
      game: rawgRES.data,
      price: getPrice,
    };

    return gameData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error: ", error);
    } else {
      console.error("Unexpected Error: ", error);
    }
    return null;
  }
}
