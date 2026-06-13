import express from "express";
import { tenantMiddleware } from "../middleware/tenantMiddleware.js";
import pool from "../db/pool.js";

const router = express.Router();

router.get("/", tenantMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM leads WHERE client_id = $1 ORDER BY created_at DESC",
      [req.client.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Leads GET error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", tenantMiddleware, async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO leads (client_id, name, email, phone, message)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.client.id, name, email, phone, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Leads POST error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
