import pool from "../db/pool.js";

export async function enforceUsageLimit(req, res, next) {
  const client = req.client;

  const result = await pool.query(
    `SELECT * FROM usage WHERE client_id = $1 AND date = CURRENT_DATE`,
    [client.id]
  );

  const usage = result.rows[0] || {
    messages: 0,
    leads: 0,
    bookings: 0,
    api_calls: 0,
  };

  if (usage.messages >= client.message_limit) {
    return res.status(429).json({ error: "Message limit reached" });
  }

  if (usage.leads >= client.lead_limit) {
    return res.status(429).json({ error: "Lead limit reached" });
  }

  if (usage.bookings >= client.booking_limit) {
    return res.status(429).json({ error: "Booking limit reached" });
  }

  if (usage.api_calls >= client.api_limit) {
    return res.status(429).json({ error: "API limit reached" });
  }

  next();
}
0
