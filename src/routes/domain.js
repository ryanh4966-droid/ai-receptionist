import express from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import { verifyDomain } from "../services/domainService.js";
import pool from "../db/pool.js";

const router = express.Router();

router.post("/set", authRequired, async (req, res) => {
  const { domain } = req.body;
  const clientId = req.user.client_id;

  await pool.query(
    `UPDATE clients SET custom_domain = $1, domain_verified = false WHERE id = $2`,
    [domain, clientId]
  );

  res.json({ success: true });
});

router.post("/verify", authRequired, async (req, res) => {
  const { domain } = req.body;
  const clientId = req.user.client_id;

  const ok = await verifyDomain(clientId, domain);
  res.json({ verified: ok });
});

router.get("/current", authRequired, async (req, res) => {
  const clientId = req.user.client_id;

  const result = await pool.query(
    `SELECT custom_domain, domain_verified FROM clients WHERE id = $1`,
    [clientId]
  );

  res.json(result.rows[0]);
});

export default router;
