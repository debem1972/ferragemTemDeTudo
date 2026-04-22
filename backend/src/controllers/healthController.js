import { checkDatabaseConnection } from '../config/database.js';

export async function getHealth(_request, response) {
  try {
    await checkDatabaseConnection();

    response.status(200).json({
      status: 'ok',
      api: 'online',
      database: 'connected',
    });
  } catch (error) {
    response.status(503).json({
      status: 'error',
      api: 'online',
      database: 'disconnected',
      message: 'Nao foi possivel estabelecer conexao com o MySQL.',
    });
  }
}
