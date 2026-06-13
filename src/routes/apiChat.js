import express from "express";
import { apiKeyRequired } from "../middleware/apiKeyMiddleware.js";
import { askAI } from "../services/aiService.js";

const router = express.Router();

router.post("/", apiKeyRequired, async (req, res) => {
  const { message } = req.body;
  const client = req.client;

  const { aiReply } = await askAI(client, message);

  res.json({ reply: aiReply });
});

export default router;
