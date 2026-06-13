import axios from "axios";
import pool from "../db/pool.js";
import { extractLeadInfo } from "./leadService.js";

export async function askAI(client, message) {
  const settingsRes = await pool.query(
    "SELECT * FROM settings WHERE client_id = $1",
    [client.id]
  );
  const settings = settingsRes.rows[0] || {};

  const personality =
    settings.ai_personality ||
    `You are a friendly AI receptionist for ${client.business_name}.
    Always try to collect name, email, and phone number when appropriate.`;

  const prompt = `${personality}\n\nUser: ${message}`;

  const res = await axios.post("http://localhost:11434/api/generate", {
    model: "phi3",
    prompt,
  });

  const aiReply = res.data.response;

  // Extract lead info from AI reply
  const leadInfo = extractLeadInfo(aiReply);

  return { aiReply, leadInfo };
}
