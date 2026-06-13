import express from "express";
import pool from "../db/pool.js";

const router = express.Router();

router.get("/clients", async (req, res) => {
  const result = await pool.query("SELECT * FROM clients ORDER BY id ASC");
  res.json(result.rows);
});

router.post("/clients/add", async (req, res) => {
  const { id, name, domain } = req.body;

  await pool.query(
    `INSERT INTO clients (id, business_name, domain)
     VALUES ($1, $2, $3)`,
    [id, name, domain]
  );

  res.json({ success: true });
});

router.post("/clients/suspend", async (req, res) => {
  await pool.query(
    `UPDATE clients SET status = 'inactive' WHERE id = $1`,
    [req.body.id]
  );
  res.json({ success: true });
});

router.post("/clients/activate", async (req, res) => {
  await pool.query(
    `UPDATE clients SET status = 'active' WHERE id = $1`,
    [req.body.id]
  );
  res.json({ success: true });
});

router.post("/clients/delete", async (req, res) => {
  await pool.query(`DELETE FROM clients WHERE id = $1`, [req.body.id]);
  res.json({ success: true });
});

export default router;
