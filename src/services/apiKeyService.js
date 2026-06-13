

import crypto from "crypto";
import pool from "../db/pool.js";

export function generateApiKey() {
  return crypto.randomBytes(32).toString("hex");
}

export async function assignApiKey(clientId) {
  const key = generateApiKey();

  await pool.query(
    `UPDATE clients SET api_key = $1 WHERE id = $2`,
    [key, clientId]
  );

  return key;
}

export async function validateApiKey(key) {
  const result = await pool.query(
    `SELECT * FROM clients WHERE api_key = $1`,
    [key]
  );

  return result.rows[0] || null;
}

