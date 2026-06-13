// src/services/billingService.js

import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY;

// Stripe or mock mode
let stripe;

if (!stripeKey) {
  console.warn("⚠️ Stripe disabled: No STRIPE_SECRET_KEY found. Using mock billing service.");

  stripe = {
    checkout: {
      sessions: {
        create: async () => ({
          id: "mock_session_123",
          url: "https://example.com/mock-checkout",
        }),
      },
    },
    webhookConstructEvent: () => null,
  };
} else {
  stripe = new Stripe(stripeKey);
}

// Create checkout session
export async function createCheckoutSession(priceId, successUrl, cancelUrl) {
  return await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
}

// Handle Stripe webhook
export function handleStripeWebhook(req, signature) {
  if (!stripeKey) {
    console.warn("⚠️ Webhook ignored (mock mode).");
    return null;
  }

  return stripe.webhooks.constructEvent(
    req.rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
}

export default {
  createCheckoutSession,
  handleStripeWebhook,
};
