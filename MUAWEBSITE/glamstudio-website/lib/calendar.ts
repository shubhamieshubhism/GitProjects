import { createEvent } from "ics";

export function generateICalEvent({
  title,
  startDate,
  endDate,
  location,
  description,
}: {
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  description?: string;
}): Promise<string> {
  return new Promise((resolve, reject) => {
    createEvent(
      {
        title,
        start: [
          startDate.getFullYear(),
          startDate.getMonth() + 1,
          startDate.getDate(),
          startDate.getHours(),
          startDate.getMinutes(),
        ],
        end: [
          endDate.getFullYear(),
          endDate.getMonth() + 1,
          endDate.getDate(),
          endDate.getHours(),
          endDate.getMinutes(),
        ],
        location: location || "GlamStudio Studio",
        description: description || "Makeup appointment",
        status: "CONFIRMED",
      },
      (error, value) => {
        if (error) reject(error);
        else resolve(value);
      }
    );
  });
}

export function generateGoogleCalendarLink({
  title,
  startDate,
  endDate,
  location,
  details,
}: {
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  details?: string;
}): string {
  const base = "https://www.google.com/calendar/render?action=TEMPLATE";
  const text = encodeURIComponent(title);
  const dates = `${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}`;
  const loc = location ? encodeURIComponent(location) : "";
  const det = details ? encodeURIComponent(details) : "";
  return `${base}&text=${text}&dates=${dates}&location=${loc}&details=${det}`;
}

function formatDateForGoogle(date: Date): string {
  return date
    .toISOString()
    .replace(/-|:|\.\d+/g, "")
    .slice(0, 15);
}