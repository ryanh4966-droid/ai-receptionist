import pool from "../db/pool.js";

export async function incrementUsage(clientId, field) {
  await pool.query(
    `INSERT INTO usage (client_id, ${field})
     VALUES ($1, 1)
     ON CONFLICT (client_id, date)
     DO UPDATE SET ${field} = usage.${field} + 1`,
    [clientId]
  );
}

export async function getUsage(clientId) {
  const result = await pool.query(
    `SELECT * FROM usage WHERE client_id = $1 ORDER BY date DESC LIMIT 30`,
    [clientId]
  );
  return result.rows;
}

