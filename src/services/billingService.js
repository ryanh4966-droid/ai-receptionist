import Stripe from "stripe";
import pool from "../db/pool.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createCheckoutSession(clientId, priceId) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: "http://localhost:8081?success=true",
    cancel_url: "http://localhost:8081?canceled=true",
    metadata: { clientId },
  });

  return session.url;
}

export async function handleStripeWebhook(event) {
  const data = event.data.object;

  if (event.type === "checkout.session.completed") {
    const clientId = data.metadata.clientId;

    await pool.query(
      `UPDATE clients SET status = 'active', plan = 'basic' WHERE id = $1`,
      [clientId]
    );
  }

  if (event.type === "invoice.payment_failed") {
    const subscription = data.subscription;
    const sub = await stripe.subscriptions.retrieve(subscription);

    const clientId = sub.metadata.clientId;

    await pool.query(
      `UPDATE clients SET status = 'inactive' WHERE id = $1`,
      [clientId]
    );
  }
}
