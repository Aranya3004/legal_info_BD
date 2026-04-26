const express = require('express');
const router = express.Router();
const { verifyToken, requireLawyer } = require('../middleware/auth');

const {
  createConversation,
  getConversations,
  getMessages,
  sendMessage,
  deleteConversation,
  analyzeCase,
  getProtocol,        // <-- new import
  getSylhetAct        // <-- new import
} = require('../controllers/aiController');

// Attach middleware (auth + role check)
// This means ALL routes below require a valid Lawyer token
router.use(verifyToken, requireLawyer);

// ============================================
// CONVERSATION ROUTES
// ============================================

router.post('/conversations', createConversation);
router.get('/conversations', getConversations);
router.delete('/conversations/:id', deleteConversation);

// ============================================
// MESSAGE ROUTES
// ============================================

router.get('/conversations/:id/messages', getMessages);
router.post('/conversations/:id/messages', sendMessage);

// ============================================
// RAG ANALYSIS ROUTE
// ============================================

router.post('/analyze-case', analyzeCase);

// ============================================
// NEW DIRECT FETCH ROUTES FOR HERO BUTTONS
// ============================================

router.get('/protocol/:title', getProtocol);      // e.g. /api/ai/protocol/Heat%20Protection%20Protocol
router.get('/sylhet-act', getSylhetAct);          // /api/ai/sylhet-act

module.exports = router;