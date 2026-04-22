import app from './src/app.js';
import { env } from './src/config/env.js';

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
