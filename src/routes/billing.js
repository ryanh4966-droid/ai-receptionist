// src/routes/billing.js

import express from "express";
import {
  createCheckoutSession,
  handleStripeWebhook,
} from "../services/billingService.js";

const router = express.Router();

// Create checkout session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { priceId } = req.body;

    const session = await createCheckoutSession(
      priceId,
      process.env.SUCCESS_URL || "https://example.com/success",
      process.env.CANCEL_URL || "https://example.com/cancel"
    );

    res.json({ url: session.url });
  } catch (err) {
    console.error("Checkout session error:", err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

// Stripe webhook
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    try {
      const signature = req.headers["stripe-signature"];
      const event = handleStripeWebhook(req, signature);

      res.json({ received: true });
    } catch (err) {
      console.error("Webhook error:", err);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);

export default router;
