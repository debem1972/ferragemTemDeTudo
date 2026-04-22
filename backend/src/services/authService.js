import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { findUserByEmail } from '../models/userModel.js';
import { createHttpError } from '../utils/httpError.js';
import { verifyPassword } from '../utils/password.js';

export async function authenticateAdmin(credentials) {
  const { email, password } = credentials;

  if (!email || !password) {
    throw createHttpError(400, 'Email e senha sao obrigatorios.');
  }

  const user = await findUserByEmail(email);

  if (!user) {
    throw createHttpError(401, 'Credenciais invalidas.');
  }

  const passwordMatches = verifyPassword(password, user.senha_hash);

  if (!passwordMatches) {
    throw createHttpError(401, 'Credenciais invalidas.');
  }

  if (user.role !== 'admin') {
    throw createHttpError(403, 'Acesso restrito ao painel administrativo.');
  }

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      nome: user.nome,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    },
  );

  return {
    token,
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
    },
  };
}
