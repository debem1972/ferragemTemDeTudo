import express from 'express';
import apiRoutes from './routes/index.js';
import { notFoundHandler } from './middlewares/notFoundMiddleware.js';
import { errorHandler } from './middlewares/errorMiddleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
