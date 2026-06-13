import express from "express";
import { tenantMiddleware } from "../middleware/tenantMiddleware.js";
import { askAI } from "../services/aiService.js";
import { saveLead } from "../services/leadService.js";
import pool from "../db/pool.js";

const router = express.Router();

router.post("/", tenantMiddleware, async (req, res) => {
  const { message } = req.body;
  const client = req.client;

  if (!message) {
    return res.status(400).json({ error: "message is required" });
  }

  try {
    const { aiReply, leadInfo } = await askAI(client, message);

    // Save lead if detected
    let savedLead = null;
    if (leadInfo && Object.keys(leadInfo).length > 0) {
      savedLead = await saveLead(client.id, {
        ...leadInfo,
        message,
      });
    }

    // Log conversation
    await pool.query(
      "INSERT INTO conversations (client_id, transcript) VALUES ($1, $2)",
      [
        client.id,
        JSON.stringify({
          user: message,
          ai: aiReply,
          leadCaptured: savedLead ? true : false,
        }),
      ]
    );

    res.json({
      reply: aiReply,
      leadCaptured: savedLead ? true : false,
      lead: savedLead || null,
    });
  } catch (err) {
    console.error("Chat route error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
