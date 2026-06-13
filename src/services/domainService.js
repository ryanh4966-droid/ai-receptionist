import dns from "dns/promises";
import pool from "../db/pool.js";

export async function verifyDomain(clientId, domain) {
  try {
    const records = await dns.resolveCname(domain);

    const isValid = records.some(r =>
      r.includes(process.env.ROOT_DOMAIN)
    );

    if (isValid) {
      await pool.query(
        `UPDATE clients SET custom_domain = $1, domain_verified = true WHERE id = $2`,
        [domain, clientId]
      );
    }

    return isValid;
  } catch (err) {
    return false;
  }
}
