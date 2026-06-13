import { chunkText } from "./chunkService.js";

export async function storeKnowledge(clientId, content) {
  const chunks = chunkText(content);

  for (const chunk of chunks) {
    const embedding = await embedText(chunk);

    await pool.query(
      `INSERT INTO knowledge (client_id, content, embedding)
       VALUES ($1, $2, $3)`,
      [clientId, chunk, embedding]
    );
  }
}
