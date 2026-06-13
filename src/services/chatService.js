// src/services/chatService.js

import OpenAI from "openai";

// Load API key
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "mock-key",
});

// Local mock mode if no key is provided
const mockMode = !process.env.OPENAI_API_KEY;

export async function processMessage(message) {
  if (mockMode) {
    console.warn("⚠️ AI running in MOCK MODE (no OPENAI_API_KEY found)");
    return `Mock reply: You said "${message}"`;
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an AI receptionist." },
        { role: "user", content: message }
      ],
    });

    return completion.choices[0].message.content;
  } catch (err) {
    console.error("AI error:", err);
    return "AI processing failed.";
  }
}

export default {
  processMessage,
};
