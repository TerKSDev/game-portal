export type Event = {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone: string;
  };
};

export async function fetchGoogleCalendarEvents(): Promise<Event[]> {
  try {
    const API_KEY = process.env.GOOGLE_CALENDAR_KEY;
    const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

    if (!API_KEY || !CALENDAR_ID) {
      console.error("Missing environment variables:", {
        hasApiKey: !!API_KEY,
        hasCalendarId: !!CALENDAR_ID,
      });
      return [];
    }

    const params = new URLSearchParams({
      key: API_KEY,
      showDeleted: "false",
      singleEvents: "true",
      orderBy: "startTime",
      maxResults: "50",
    });

    const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        Referer: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
      },
      next: {
        revalidate: 120,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch events from Google Calendar:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      return [];
    }

    const data = await response.json();
    console.log("Google Calendar API Response:", {
      totalItems: data.items?.length || 0,
      items: data.items,
    });
    return data.items || [];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}
