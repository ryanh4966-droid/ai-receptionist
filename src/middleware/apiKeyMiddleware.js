import { validateApiKey } from "../services/apiKeyService.js";

export async function apiKeyRequired(req, res, next) {
  const key = req.headers["x-api-key"];

  if (!key) {
    return res.status(401).json({ error: "Missing API key" });
  }

  const client = await validateApiKey(key);

  if (!client) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  req.client = client;
  next();
}
