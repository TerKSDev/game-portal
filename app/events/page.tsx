import { FaCalendarAlt, FaClock } from "react-icons/fa";
import Link from "next/link";
import { PATHS } from "@/app/_config/routes";
import { fetchGoogleCalendarEvents } from "@/lib/event";
import type { Event } from "@/lib/event";

export const metadata = {
  title: "Events",
  description: "Upcoming gaming events and tournaments.",
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTimeZoneOffset(timeZone: string): string {
  try {
    const date = new Date();
    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const tzDate = new Date(date.toLocaleString("en-US", { timeZone }));
    const offset = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
    const sign = offset >= 0 ? "+" : "";
    return `(UTC ${sign}${offset})`;
  } catch (error) {
    return "(UTC +8)"; // 默認返回 UTC +8
  }
}

function EventCard({ event }: { event: Event }) {
  const startDateTime = event.start.dateTime || event.start.date;
  const endDateTime = event.end.dateTime || event.end.date;

  if (!startDateTime || !endDateTime) {
    console.error("Missing date for event:", event);
    return null;
  }

  const startDate = formatDate(startDateTime);
  const startTime = event.start.dateTime
    ? formatTime(startDateTime)
    : "All day";
  const endTime = event.end.dateTime ? formatTime(endDateTime) : "";
  const timeZone = getTimeZoneOffset(event.start.timeZone);

  return (
    <div className="group bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-blue-500/50 p-6 transition-all duration-300 hover:transform hover:scale-[1.01] hover:shadow-xl hover:shadow-blue-500/10">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors flex-1">
            {event.summary}
          </h3>
          <div className="flex items-center gap-2 text-gray-400 bg-gray-800/50 px-3 py-1.5 rounded-lg shrink-0">
            <FaCalendarAlt size={14} />
            <span className="text-sm font-medium">{startDate}</span>
          </div>
        </div>

        {event.description && (
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
            {event.description}
          </p>
        )}

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <FaClock size={14} className="text-blue-400" />
            <span>
              {startTime}
              {endTime && ` - ${endTime}`} {timeZone}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function Event() {
  const events = await fetchGoogleCalendarEvents();

  console.log("Events page - Total events:", events.length);
  if (events.length > 0) {
    console.log("First event:", events[0]);
  }

  return (
    <div className="flex flex-1 flex-col pt-32 px-4 sm:px-6 lg:px-8 pb-12 min-h-screen">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-8 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Upcoming Events
        </h1>

        <div className="flex flex-col gap-4">
          {events.length > 0 ? (
            events.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <div className="flex items-center justify-center min-h-100">
              <div className="flex flex-col text-center justify-center items-center gap-8">
                <FaCalendarAlt size={42} className="text-gray-500" />
                <div className="gap-1.5">
                  <p className="text-gray-400 text-xl">No upcoming events</p>
                  <p className="text-gray-500 text-sm">
                    Check back later for exciting gaming events!
                  </p>
                </div>
                <Link
                  href={PATHS.STORE}
                  className="inline-block bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-12 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
                >
                  Browse Store
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
