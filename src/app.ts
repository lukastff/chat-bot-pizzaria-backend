import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import messagesRoutes from './routes/messagesRoutes.js';
import { getDB } from './db/database.js';

dotenv.config();

// Ensure DB is initialized on app start
getDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/', messagesRoutes);

export default app;
