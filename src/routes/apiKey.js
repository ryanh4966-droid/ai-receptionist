import express from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import { assignApiKey } from "../services/apiKeyService.js";
import pool from "../db/pool.js";

const router = express.Router();

router.post("/generate", authRequired, async (req, res) => {
  const clientId = req.user.client_id;

  const key = await assignApiKey(clientId);
  res.json({ api_key: key });
});

router.get("/current", authRequired, async (req, res) => {
  const clientId = req.user.client_id;

  const result = await pool.query(
    `SELECT api_key FROM clients WHERE id = $1`,
    [clientId]
  );

  res.json({ api_key: result.rows[0].api_key });
});

export default router;
