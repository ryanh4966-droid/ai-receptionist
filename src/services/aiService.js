import axios from "axios";
import pool from "../db/pool.js";

export async function askAI(client, message) {
  const settingsRes = await pool.query(
    "SELECT * FROM settings WHERE client_id = $1",
    [client.id]
  );
  const settings = settingsRes.rows[0] || {};

  const personality =
    settings.ai_personality ||
    `You are a friendly AI receptionist for ${client.business_name}. 
    Collect name, email, phone when possible and help with bookings.`;

  const prompt = `${personality}\n\nUser: ${message}`;

  const res = await axios.post("http://localhost:11434/api/generate", {
    model: "phi3",
    prompt,
  });

  return res.data.response;
}
