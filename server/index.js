import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import placesRoutes from './routes/places.js';
import authRoutes from './routes/auth.js';
import recommendRoutes from './routes/recommend.js';
import searchRoutes from './routes/search.js';

// Load .env from project root (where npm run dev is executed)
const __filename = fileURLToPath(import.meta.url);
const projectRoot = path.dirname(path.dirname(__filename));
const envPath = path.join(projectRoot, '.env');

dotenv.config({ path: envPath });

// Use port from env or fallback to 3001
const PORT = process.env.PORT || 3001;

console.log('[Server] TELEGRAM_BOT_TOKEN loaded:', !!process.env.TELEGRAM_BOT_TOKEN);
console.log('[Server] Starting on port:', PORT);

// Import bot after env is set (static import to ensure same process context)
import './bot.js';

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

app.use(cors());
app.use(express.json());

app.use('/api/places', placesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/recommend', recommendRoutes);
app.use('/api/search', searchRoutes);

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

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('[Server] Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[Server] SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('[Server] Server closed');
    process.exit(0);
  });
});
