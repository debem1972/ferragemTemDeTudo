import {
  createProduct,
  deleteProduct,
  findAllActiveProducts,
  findProductById,
  findProductBySlug,
  updateProduct,
} from '../models/productModel.js';
import { findCategoryById } from '../models/categoryModel.js';
import { createHttpError } from '../utils/httpError.js';
import { slugify } from '../utils/slugify.js';

function parseBoolean(value, defaultValue = true) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalizedValue = value.trim().toLowerCase();

    if (['true', '1', 'sim'].includes(normalizedValue)) {
      return true;
    }

    if (['false', '0', 'nao', 'não'].includes(normalizedValue)) {
      return false;
    }
  }

  if (typeof value === 'number') {
    return value === 1;
  }

  return defaultValue;
}

function normalizeProductPayload(productData) {
  const nome = productData.nome?.trim();
  const descricaoCurta = productData.descricaoCurta?.trim() || '';
  const descricaoCompleta = productData.descricaoCompleta?.trim() || '';
  const preco = Number(productData.preco);
  const estoque = Number(productData.estoque);
  const categoriaId = Number(productData.categoriaId);
  const ativo = parseBoolean(productData.ativo, true);

  if (!nome) {
    throw createHttpError(400, 'O nome do produto e obrigatorio.');
  }

  if (Number.isNaN(preco) || preco < 0) {
    throw createHttpError(400, 'O preco do produto deve ser valido.');
  }

  if (Number.isNaN(estoque) || estoque < 0) {
    throw createHttpError(400, 'O estoque do produto deve ser valido.');
  }

  if (Number.isNaN(categoriaId) || categoriaId <= 0) {
    throw createHttpError(400, 'A categoria do produto deve ser valida.');
  }

  return {
    categoriaId,
    nome,
    slug: slugify(productData.slug || nome),
    descricaoCurta,
    descricaoCompleta,
    preco,
    estoque,
    ativo,
  };
}

async function ensureCategoryExists(categoriaId) {
  const category = await findCategoryById(categoriaId);

  if (!category) {
    throw createHttpError(400, 'A categoria informada nao existe.');
  }
}

async function ensureUniqueSlug(slug, currentProductId = null) {
  const existingProduct = await findProductBySlug(slug);

  if (existingProduct && existingProduct.id !== Number(currentProductId)) {
    throw createHttpError(409, 'Ja existe um produto com este slug.');
  }
}

export async function listProductsService() {
  return findAllActiveProducts();
}

export async function getProductByIdService(id) {
  const product = await findProductById(id);

  if (!product) {
    throw createHttpError(404, 'Produto nao encontrado.');
  }

  return product;
}

export async function createProductService(productData) {
  const normalizedPayload = normalizeProductPayload(productData);

  await ensureCategoryExists(normalizedPayload.categoriaId);
  await ensureUniqueSlug(normalizedPayload.slug);

  return createProduct(normalizedPayload);
}

export async function updateProductService(id, productData) {
  await getProductByIdService(id);
  const normalizedPayload = normalizeProductPayload(productData);

  await ensureCategoryExists(normalizedPayload.categoriaId);
  await ensureUniqueSlug(normalizedPayload.slug, id);

  return updateProduct(id, normalizedPayload);
}

export async function deleteProductService(id) {
  await getProductByIdService(id);
  await deleteProduct(id);
}
