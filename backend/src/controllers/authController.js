import { authenticateAdmin } from '../services/authService.js';

export async function login(request, response) {
  const tokenData = await authenticateAdmin(request.body);

  response.status(200).json({
    message: 'Login realizado com sucesso.',
    ...tokenData,
  });
}
