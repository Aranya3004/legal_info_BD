const express = require('express');
const router = express.Router();
const pool = require('../config/db');   // same as casesRoutes

// GET /api/acts/sections?act_title=...&year=...
router.get('/acts/sections', async (req, res) => {
  try {
    const { act_title, year } = req.query;
    if (!act_title || !year) {
      return res.status(400).json({ error: 'act_title and year are required' });
    }

    const result = await pool.query(
      `SELECT
         act_title,
         act_year AS year,
         sec->>'section_content' AS section,
         government_context->>'govt_system' AS govt_system
       FROM context_legal_dataset,
            jsonb_array_elements(sections) AS sec
       WHERE act_title = $1 AND act_year = $2
       ORDER BY sec->>'section_content'`,
      [act_title, Number(year)]   // ensure year is a number
    );

    res.json({ sections: result.rows });
  } catch (err) {
    console.error('Error fetching sections:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;