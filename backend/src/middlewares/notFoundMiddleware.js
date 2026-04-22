export function notFoundHandler(request, _response, next) {
  const error = new Error(`Rota nao encontrada: ${request.originalUrl}`);
  error.statusCode = 404;
  next(error);
}
