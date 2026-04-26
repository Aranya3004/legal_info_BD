const pool = require('../config/db');

// ============================================
// CONTROLLER 1: Create a New Case
// POST /api/cases
// Lawyers only
// ============================================
const createCase = async (req, res) => {
  try {
    const {
      case_number, title, description,
      case_type, client_name, client_email, priority
    } = req.body;

    const assigned_lawyer_id = req.user.id; // The logged-in lawyer owns this case

    if (!title) {
      return res.status(400).json({ error: 'Case title is required.' });
    }

    // Auto-generate a case number if not provided
    const finalCaseNumber = case_number ||
      `CASE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const result = await pool.query(
      `INSERT INTO cases 
        (case_number, title, description, case_type, client_name, 
         client_email, priority, assigned_lawyer_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [
        finalCaseNumber, title, description || null,
        case_type || null, client_name || null,
        client_email || null, priority || 'medium',
        assigned_lawyer_id
      ]
    );

    return res.status(201).json({
      message: 'Case created successfully.',
      case: result.rows[0],
    });
  } catch (error) {
    // Handle duplicate case number
    if (error.code === '23505') {
      return res.status(409).json({ error: 'A case with this number already exists.' });
    }
    console.error('Create case error:', error.message);
    return res.status(500).json({ error: 'Failed to create case.' });
  }
};

// ============================================
// CONTROLLER 2: Get All Cases
// GET /api/cases
// Lawyers see their own cases, workers see all cases
// ============================================
const getCases = async (req, res) => {
  try {
    let result;

    if (req.user.role === 'lawyer') {
      // Lawyers only see cases assigned to them
      result = await pool.query(
        `SELECT c.*, u.full_name as lawyer_name
         FROM cases c
         JOIN users u ON c.assigned_lawyer_id = u.id
         WHERE c.assigned_lawyer_id = $1
         ORDER BY c.created_at DESC`,
        [req.user.id]
      );
    } else {
      // Workers can see all cases (read-only view)
      result = await pool.query(
        `SELECT c.*, u.full_name as lawyer_name
         FROM cases c
         JOIN users u ON c.assigned_lawyer_id = u.id
         ORDER BY c.created_at DESC`
      );
    }

    return res.status(200).json({ cases: result.rows });
  } catch (error) {
    console.error('Get cases error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch cases.' });
  }
};

// ============================================
// CONTROLLER 3: Get a Single Case by ID
// GET /api/cases/:id
// ============================================
const getCaseById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT c.*, u.full_name as lawyer_name
       FROM cases c
       JOIN users u ON c.assigned_lawyer_id = u.id
       WHERE c.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Case not found.' });
    }

    // Lawyers can only view their own cases
    const caseData = result.rows[0];
    if (req.user.role === 'lawyer' && caseData.assigned_lawyer_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    return res.status(200).json({ case: caseData });
  } catch (error) {
    console.error('Get case error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch case.' });
  }
};

// ============================================
// CONTROLLER 4: Update a Case
// PUT /api/cases/:id
// Lawyers only, and only their own cases
// ============================================
const updateCase = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, description, status,
      case_type, client_name, client_email, priority
    } = req.body;

    // Verify ownership
    const ownerCheck = await pool.query(
      'SELECT id FROM cases WHERE id = $1 AND assigned_lawyer_id = $2',
      [id, req.user.id]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Case not found or access denied.' });
    }

    const result = await pool.query(
      `UPDATE cases SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        status = COALESCE($3, status),
        case_type = COALESCE($4, case_type),
        client_name = COALESCE($5, client_name),
        client_email = COALESCE($6, client_email),
        priority = COALESCE($7, priority),
        updated_at = NOW(),
        -- If status is being set to 'closed', record the timestamp
        closed_at = CASE WHEN $3 = 'closed' THEN NOW() ELSE closed_at END
       WHERE id = $8
       RETURNING *`,
      [title, description, status, case_type,
       client_name, client_email, priority, id]
    );

    return res.status(200).json({
      message: 'Case updated successfully.',
      case: result.rows[0],
    });
  } catch (error) {
    console.error('Update case error:', error.message);
    return res.status(500).json({ error: 'Failed to update case.' });
  }
};

// ============================================
// CONTROLLER 5: Delete a Case
// DELETE /api/cases/:id
// Lawyers only, own cases only
// ============================================
const deleteCase = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM cases WHERE id = $1 AND assigned_lawyer_id = $2 RETURNING id',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Case not found or access denied.' });
    }

    return res.status(200).json({ message: 'Case deleted successfully.' });
  } catch (error) {
    console.error('Delete case error:', error.message);
    return res.status(500).json({ error: 'Failed to delete case.' });
  }
};

module.exports = { createCase, getCases, getCaseById, updateCase, deleteCase };