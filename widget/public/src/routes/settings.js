import express from "express";
import { tenantMiddleware } from "../middleware/tenantMiddleware.js";
import pool from "../db/pool.js";

const router = express.Router();

router.get("/", tenantMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM settings WHERE client_id = $1",
      [req.client.id]
    );
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error("Settings GET error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", tenantMiddleware, async (req, res) => {
  const { ai_personality, widget_color, booking_enabled } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO settings (client_id, ai_personality, widget_color, booking_enabled)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (client_id)
       DO UPDATE SET ai_personality = EXCLUDED.ai_personality,
                     widget_color = EXCLUDED.widget_color,
                     booking_enabled = EXCLUDED.booking_enabled
       RETURNING *`,
      [req.client.id, ai_personality, widget_color, booking_enabled]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Settings POST error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
