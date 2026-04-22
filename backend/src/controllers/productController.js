import {
  createProductService,
  deleteProductService,
  getProductByIdService,
  listProductsService,
  updateProductService,
} from '../services/productService.js';

export async function listProducts(_request, response) {
  const products = await listProductsService();
  response.status(200).json(products);
}

export async function getProductById(request, response) {
  const product = await getProductByIdService(request.params.id);
  response.status(200).json(product);
}

export async function createProduct(request, response) {
  const createdProduct = await createProductService(request.body);
  response.status(201).json(createdProduct);
}

export async function updateProduct(request, response) {
  const updatedProduct = await updateProductService(request.params.id, request.body);
  response.status(200).json(updatedProduct);
}

export async function deleteProduct(request, response) {
  await deleteProductService(request.params.id);
  response.status(204).send();
}
