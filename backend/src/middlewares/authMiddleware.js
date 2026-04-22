import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function authenticateToken(request, response, next) {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader?.startsWith('Bearer ')) {
    return response.status(401).json({
      message: 'Token de acesso nao informado.',
    });
  }

  const token = authorizationHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    request.user = decoded;
    return next();
  } catch (error) {
    return response.status(401).json({
      message: 'Token invalido ou expirado.',
    });
  }
}
