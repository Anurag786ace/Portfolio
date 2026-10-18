import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import contactRoutes from './routes/contactRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: '*', // Allows requests from Vite dev server and any portfolio deployment
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging in development
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.originalUrl.startsWith('/api')) {
      console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

  res.json({
    status: 'ok',
    service: 'Anurag Giri Portfolio Backend',
    database: states[dbState] || 'unknown',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', contactRoutes);

// Root greeting
app.get('/', (req, res) => {
  res.send({
    message: 'Anurag Giri Portfolio API is online',
    health: '/api/health',
    contactEndpoint: '/api/contact',
    subscribeEndpoint: '/api/subscribe'
  });
});

// 404 handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
});

// Start server
async function startServer() {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`\n====================================================`);
    console.log(`🚀 Portfolio Backend listening on http://localhost:${PORT}`);
    console.log(`📊 Health check:   http://localhost:${PORT}/api/health`);
    console.log(`📩 Messages API:   http://localhost:${PORT}/api/contact`);
    console.log(`📬 Newsletter API: http://localhost:${PORT}/api/subscribe`);
    console.log(`====================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ [PORT CONFLICT] Port ${PORT} is already in use by another process.`);
      console.error(`Please terminate any process using port ${PORT} or update PORT in .env.\n`);
    } else {
      console.error('\n❌ Server error:', err.message);
    }
  });
}

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down server...');
  await mongoose.disconnect();
  process.exit(0);
});
