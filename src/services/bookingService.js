import { google } from "googleapis";

/**
 * Creates a Google Calendar client using a service account.
 */
export function getCalendarClient() {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/calendar"]
  );

  return google.calendar({ version: "v3", auth });
}

/**
 * Create an appointment on the business's calendar.
 */
export async function createBooking({ summary, description, start, end }) {
  const calendar = getCalendarClient();

  const event = {
    summary,
    description,
    start: { dateTime: start },
    end: { dateTime: end },
  };

  const res = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    resource: event,
  });

  return res.data;
}
