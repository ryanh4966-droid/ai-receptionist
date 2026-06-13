import pkg from "pg";
const { Pool } = pkg;
import cors from "cors";
app.use(cors()); 
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ai_receptionist",
  password: "", // set if you use a password
  port: 5432,
});

export default pool;
import analyticsRouter from "./routes/analytics.js";
app.use("/api/analytics", analyticsRouter);
import billingRouter from "./routes/billing.js";
app.use("/api/billing", billingRouter);
import apiKeyRouter from "./routes/apiKey.js";
app.use("/api/apikey", apiKeyRouter);
import apiChatRouter from "./routes/apiChat.js";
app.use("/api/chat-api", apiChatRouter);
import domainRouter from "./routes/domain.js";
app.use("/api/domain", domainRouter);
import teamRouter from "./routes/team.js";
app.use("/api/team", teamRouter);
