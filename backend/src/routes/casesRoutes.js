const express = require('express');
const router = express.Router();
const { verifyToken, requireLawyer } = require('../middleware/auth');
const {
  createCase, getCases, getCaseById,
  updateCase, deleteCase
} = require('../controllers/casesController');

// GET /api/cases — both lawyers and workers can view cases
router.get('/', verifyToken, getCases);
router.get('/:id', verifyToken, getCaseById);

// These routes require lawyer role
router.post('/', verifyToken, requireLawyer, createCase);
router.put('/:id', verifyToken, requireLawyer, updateCase);
router.delete('/:id', verifyToken, requireLawyer, deleteCase);

module.exports = router;