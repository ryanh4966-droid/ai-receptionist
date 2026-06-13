import pool from "../db/pool.js";

export async function tenantMiddleware(req, res, next) {
  const host = req.headers.host.split(":")[0];

  let client;

  // 1. Custom domain
  const custom = await pool.query(
    `SELECT * FROM clients WHERE custom_domain = $1 AND domain_verified = true`,
    [host]
  );

  if (custom.rows.length > 0) {
    client = custom.rows[0];
  }

  // 2. Default domain with ?client_id=
  if (!client && req.query.client_id) {
    const fallback = await pool.query(
      `SELECT * FROM clients WHERE id = $1`,
      [req.query.client_id]
    );
    client = fallback.rows[0];
  }

  if (!client) {
    return res.status(404).json({ error: "Client not found" });
  }

  req.client = client;
  next();
}
