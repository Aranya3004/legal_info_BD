// ============================================
// ENV CONFIG (MUST BE FIRST)
// ============================================
require('dotenv').config();

// ============================================
// CORE IMPORTS
// ============================================
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// OpenRouter SDK
const { OpenRouter } = require('@openrouter/sdk');

// Database connection (runs on startup)
require('./config/db');

// ============================================
// OPENROUTER SETUP
// ============================================
const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.FRONTEND_URL || "https://legal-info-bd-9q7f.vercel.app",
    "X-OpenRouter-Title": "Legal AI Backend",
  },
});

// ============================================
// EXPRESS APP
// ============================================
const app = express();

// Make OpenRouter available globally in routes
app.set("openRouter", openRouter);

// ============================================
// MIDDLEWARE
// ============================================
app.use(helmet());

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://legal-info-bd-9q7f.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.error(`CORS blocked: ${origin}`);
    callback(new Error(`CORS blocked: ${origin} is not allowed`));
  },
  credentials: true,
}));

app.use(express.json());

// Rate limiter (basic protection)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// ============================================
// ROUTES
// ============================================

// Auth routes
try {
  const authRoutes = require('./routes/authRoutes');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded');
} catch (err) {
  console.warn('⚠️  Auth routes not loaded:', err.message);
  app.post('/api/auth/register', (req, res) => {
    res.status(500).json({ error: 'Auth service not available' });
  });
  app.post('/api/auth/login', (req, res) => {
    res.status(500).json({ error: 'Auth service not available' });
  });
}

// AI routes
try {
  const aiRoutes = require('./routes/aiRoutes');
  app.use('/api/ai', aiRoutes);
  console.log('✅ AI routes loaded');
} catch (err) {
  console.warn('⚠️  AI routes not loaded:', err.message);
}

// Cases routes
try {
  const casesRoutes = require('./routes/casesRoutes');
  app.use('/api/cases', casesRoutes);
  console.log('✅ Cases routes loaded');
} catch (err) {
  console.warn('⚠️  Cases routes not loaded:', err.message);
}

// Sections routes
try {
  const sectionsRoute = require('./routes/sections');
  app.use('/api', sectionsRoute);
  console.log('✅ Sections routes loaded');
} catch (err) {
  console.warn('⚠️  Sections routes not loaded:', err.message);
}

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Legal AI Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.url} not found.`
  });
});

// ============================================
// GLOBAL ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Internal server error'
  });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Allowed origins: ${allowedOrigins.join(', ')}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});
