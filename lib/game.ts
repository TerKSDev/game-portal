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
  filters?: GameFilters,
) {
  const apiKey = process.env.RAWG_API_KEY;
  if (!apiKey) throw new Error("Error: API Key not found.");

  let url = `https://api.rawg.io/api/games?key=${apiKey}&page=${page}&page_size=${pageSize}`;

  if (query) {
    // Search by game name (RAWG API's search parameter searches across game names, tags, and descriptions)
    url += `&search=${encodeURIComponent(query)}`;
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
    // Only apply stores filter if explicitly specified
    if (filters.stores) {
      url += `&stores=${encodeURIComponent(filters.stores)}`;
    }
  }

  console.log("[GetGames] URL:", url);
  console.log("[GetGames] Query:", query);
  console.log("[GetGames] Filters:", filters);

  // Retry logic for handling temporary API failures
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 60 }, // Cache for 60 seconds
      });

      if (!res.ok) {
        console.error(
          `[GetGames] Attempt ${attempt}/${maxRetries} - Fetch error:`,
          res.status,
          res.statusText,
        );

        // If it's a 502/503 error and we have retries left, wait and retry
        if (
          (res.status === 502 || res.status === 503) &&
          attempt < maxRetries
        ) {
          const waitTime = attempt * 1000; // Exponential backoff: 1s, 2s, 3s
          console.log(`[GetGames] Retrying in ${waitTime}ms...`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }

        lastError = new Error(`API returned ${res.status}: ${res.statusText}`);
        continue;
      }

      const data: RAWGResponse = await res.json();
      console.log("[GetGames] Results count:", data.results.length);
      console.log("[GetGames] Total count:", data.count);
      return data.results as GameProps[];
    } catch (error) {
      console.error(
        `[GetGames] Attempt ${attempt}/${maxRetries} - Error:`,
        error,
      );
      lastError = error as Error;

      if (attempt < maxRetries) {
        const waitTime = attempt * 1000;
        console.log(`[GetGames] Retrying in ${waitTime}ms...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  // If all retries failed, return empty array instead of throwing
  console.error("[GetGames] All retries failed, returning empty array");
  console.error("[GetGames] Last error:", lastError);
  return [] as GameProps[];
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
