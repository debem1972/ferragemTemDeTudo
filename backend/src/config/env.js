import 'dotenv/config';

export const env = {
  PORT: Number(process.env.PORT) || 3000,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: Number(process.env.DB_PORT) || 3306,
  DB_NAME: process.env.DB_NAME || 'temdetudo_ferragem',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  JWT_SECRET: process.env.JWT_SECRET || 'troque-esta-chave-em-producao',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '8h',
};
