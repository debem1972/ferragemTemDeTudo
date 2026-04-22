import pool from '../config/database.js';

export async function findUserByEmail(email) {
  const [rows] = await pool.execute(
    `
      SELECT id, nome, email, senha_hash, role
      FROM usuarios
      WHERE email = ?
      LIMIT 1
    `,
    [email],
  );

  return rows[0] || null;
}
