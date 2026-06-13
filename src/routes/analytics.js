import express from "express";
import pool from "../db/pool.js";
import { tenantMiddleware } from "../middleware/tenantMiddleware.js";

const router = express.Router();

router.get("/", tenantMiddleware, async (req, res) => {
  const clientId = req.client.id;

  try {
    const leads = await pool.query(
      `SELECT COUNT(*) FROM leads WHERE client_id = $1`,
      [clientId]
    );

    const conversations = await pool.query(
      `SELECT COUNT(*) FROM conversations WHERE client_id = $1`,
      [clientId]
    );

    const bookings = await pool.query(
      `SELECT COUNT(*) FROM conversations 
       WHERE client_id = $1 AND transcript::text LIKE '%bookingCreated%'`,
      [clientId]
    );

    const dailyLeads = await pool.query(
      `SELECT DATE(created_at) AS day, COUNT(*) 
       FROM leads 
       WHERE client_id = $1 
       GROUP BY day 
       ORDER BY day ASC`,
      [clientId]
    );

    res.json({
      totalLeads: leads.rows[0].count,
      totalConversations: conversations.rows[0].count,
      totalBookings: bookings.rows[0].count,
      dailyLeads: dailyLeads.rows,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
