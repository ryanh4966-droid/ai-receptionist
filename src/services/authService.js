import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db/pool.js";

export async function registerUser(email, password, role = "client", clientId = null) {
  const hash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (email, password_hash, role, client_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, role, client_id`,
    [email, hash, role, clientId]
  );

  return result.rows[0];
}

export async function authenticateUser(email, password) {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  const user = result.rows[0];
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return null;

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      client_id: user.client_id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token, user };
}
