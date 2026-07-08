import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import placesRoutes from './routes/places.js';
import authRoutes from './routes/auth.js';
import './bot.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('[Server] UNCAUGHT EXCEPTION:', err);
  console.error('[Server] Stack trace:', err.stack);
});

process.on('unhandledRejection', (err) => {
  console.error('[Server] UNHANDLED REJECTION:', err);
  console.error('[Server] Stack trace:', err.stack);
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/places', placesRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Joyla API Server' });
});

app.get('/health', (req, res) => {
  res.send('ok');
});

const server = app.listen(PORT, () => {
  console.log(`[Server] Express server running on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('[Server] Server error:', err);
});
