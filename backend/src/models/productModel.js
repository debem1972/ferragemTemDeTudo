import pool from '../config/database.js';

export async function findAllActiveProducts() {
  const [rows] = await pool.execute(
    `
      SELECT
        p.id,
        p.categoria_id AS categoriaId,
        p.nome,
        p.slug,
        p.descricao_curta AS descricaoCurta,
        p.descricao_completa AS descricaoCompleta,
        p.preco,
        p.estoque,
        p.ativo,
        c.nome AS categoriaNome
      FROM produtos p
      LEFT JOIN categorias c ON c.id = p.categoria_id
      WHERE p.ativo = TRUE
      ORDER BY p.created_at DESC
    `,
  );

  return rows;
}

export async function findProductById(id) {
  const [rows] = await pool.execute(
    `
      SELECT
        id,
        categoria_id AS categoriaId,
        nome,
        slug,
        descricao_curta AS descricaoCurta,
        descricao_completa AS descricaoCompleta,
        preco,
        estoque,
        ativo
      FROM produtos
      WHERE id = ?
      LIMIT 1
    `,
    [id],
  );

  return rows[0] || null;
}

export async function findProductBySlug(slug) {
  const [rows] = await pool.execute(
    `
      SELECT id, slug
      FROM produtos
      WHERE slug = ?
      LIMIT 1
    `,
    [slug],
  );

  return rows[0] || null;
}

export async function createProduct(productData) {
  const [result] = await pool.execute(
    `
      INSERT INTO produtos (
        categoria_id,
        nome,
        slug,
        descricao_curta,
        descricao_completa,
        preco,
        estoque,
        ativo
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      productData.categoriaId,
      productData.nome,
      productData.slug,
      productData.descricaoCurta,
      productData.descricaoCompleta,
      productData.preco,
      productData.estoque,
      productData.ativo,
    ],
  );

  return findProductById(result.insertId);
}

export async function updateProduct(id, productData) {
  await pool.execute(
    `
      UPDATE produtos
      SET
        categoria_id = ?,
        nome = ?,
        slug = ?,
        descricao_curta = ?,
        descricao_completa = ?,
        preco = ?,
        estoque = ?,
        ativo = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    [
      productData.categoriaId,
      productData.nome,
      productData.slug,
      productData.descricaoCurta,
      productData.descricaoCompleta,
      productData.preco,
      productData.estoque,
      productData.ativo,
      id,
    ],
  );

  return findProductById(id);
}

export async function deleteProduct(id) {
  const [result] = await pool.execute('DELETE FROM produtos WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
