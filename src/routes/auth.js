import express from "express";
import { registerUser, authenticateUser } from "../services/authService.js";
import { authRequired, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, role, client_id } = req.body;

  try {
    const user = await registerUser(email, password, role, client_id);
    res.json(user);
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await authenticateUser(email, password);
  if (!result) return res.status(401).json({ error: "Invalid credentials" });

  res.json(result);
});

router.get("/me", authRequired, (req, res) => {
  res.json(req.user);
});

export default router;
