require('dotenv').config();// Load environment variables FIRST — before anything else
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import OpenRouter SDK
const { OpenRouter } = require('@openrouter/sdk');

// Import database connection (runs on startup)
require('./config/db');

// Import route files
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const casesRoutes = require('./routes/casesRoutes');
const sectionsRoute = require('./routes/sections');

// Create OpenRouter instance (GLOBAL)
const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5000",
    "X-OpenRouter-Title": "Legal AI Backend",
  },
});

// Create Express app
const app = express();

// Make OpenRouter available inside routes
app.set("openRouter", openRouter);

// ============================================
// MIDDLEWARE
// ============================================

app.use(helmet());

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
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
// Health check
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
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found.` });
});

// ============================================
// ERROR HANDLER
// ============================================

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'An unexpected server error occurred.' });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});