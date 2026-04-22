import pool from '../config/database.js';

export async function findCategoryById(id) {
  const [rows] = await pool.execute(
    `
      SELECT id, nome, slug
      FROM categorias
      WHERE id = ?
      LIMIT 1
    `,
    [id],
  );

  return rows[0] || null;
}
