import { fetchGoogleCalendarEvents } from "@/lib/event";

export async function GET() {
  const events = await fetchGoogleCalendarEvents();
  return Response.json(events);
}
