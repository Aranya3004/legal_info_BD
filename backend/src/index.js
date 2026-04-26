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
const path = require('path');

// OpenRouter SDK
const { OpenRouter } = require('@openrouter/sdk');

// Database connection (runs on startup)
require('./config/db');

// Routes
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const casesRoutes = require('./routes/casesRoutes');
const sectionsRoute = require('./routes/sections');

// ============================================
// OPENROUTER SETUP
// ============================================
const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.FRONTEND_URL || "https://localhost:3000",
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
  process.env.FRONTEND_URL,         // Set this in Render env vars after frontend is deployed
].filter(Boolean);                  // removes undefined if FRONTEND_URL is not set yet

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin} is not allowed`));
  },
  credentials: true,
}));

app.use(express.json());

// Rate limiter (basic protection)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit per IP
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// ============================================
// ROUTES
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/cases', casesRoutes);
app.use('/api', sectionsRoute);

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
// START SERVER (Render-safe)
// ============================================
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔍 Health check: /health`);
});