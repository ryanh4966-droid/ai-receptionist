// src/server.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import billingRoutes from "./routes/billing.js";
import chatRoutes from "./routes/chat.js";
import leadsRoutes from "./routes/leads.js";
import settingsRoutes from "./routes/settings.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Stripe webhook raw body
app.use(
  "/api/billing/webhook",
  express.raw({ type: "application/json" })
);

// Routes
app.use("/api/chat", chatRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/billing", billingRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({ status: "AI Receptionist Backend Running" });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
