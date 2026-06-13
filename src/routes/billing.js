import express from "express";
import Stripe from "stripe";
import { createCheckoutSession, handleStripeWebhook } from "../services/billingService.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/checkout", async (req, res) => {
  const { client_id, plan } = req.body;

  const priceId =
    plan === "pro"
      ? process.env.STRIPE_PRICE_PRO
      : process.env.STRIPE_PRICE_BASIC;

  const url = await createCheckoutSession(client_id, priceId);
  res.json({ url });
});

router.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  handleStripeWebhook(event);
  res.json({ received: true });
});

export default router;
