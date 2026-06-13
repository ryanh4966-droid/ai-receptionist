

import express from "express";
import pool from "../db/pool.js";
import { authRequired } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import bcrypt from "bcrypt";

const router = express.Router();

// List team members
router.get("/", authRequired, async (req, res) => {
  const result = await pool.query(
    `SELECT id, email, role FROM users WHERE client_id = $1`,
    [req.user.client_id]
  );
  res.json(result.rows);
});

// Invite a new team member
router.post(
  "/invite",
  authRequired,
  requireRole("owner", "admin"),
  async (req, res) => {
    const { email, role } = req.body;

    const tempPassword = Math.random().toString(36).slice(2, 10);
    const hash = await bcrypt.hash(tempPassword, 10);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, role, client_id, invited_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, role`,
      [email, hash, role, req.user.client_id, req.user.id]
    );

    res.json({
      user: result.rows[0],
      tempPassword,
    });
  }
);

// Update role
router.post(
  "/role",
  authRequired,
  requireRole("owner", "admin"),
  async (req, res) => {
    const { userId, role } = req.body;

    await pool.query(
      `UPDATE users SET role = $1 WHERE id = $2 AND client_id = $3`,
      [role, userId, req.user.client_id]
    );

    res.json({ success: true });
  }
);

export default router;
