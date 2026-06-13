import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ai_receptionist",
  password: "",
  port: 5432,
});

export default pool;import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ai_receptionist",
  password: "",
  port: 5432,
});

export default pool;
