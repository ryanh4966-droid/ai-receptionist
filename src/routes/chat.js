// src/routes/chat.js

import express from "express";
import { processMessage } from "../services/chatService.js";

const router = express.Router();

// Chat endpoint
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const reply = await processMessage(message);

    res.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Chat processing failed" });
  }
});

export default router;
