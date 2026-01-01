const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const verifyToken = require('../middleware/auth');

// Get user's goals for a specific year
router.get('/:year', verifyToken, async (req, res) => {
  const { year } = req.params;
  const { uid } = req.user;

  try {
    const result = await pool.query(
      `SELECT * FROM goals 
       WHERE firebase_uid = $1 AND year = $2`,
      [uid, year]
    );

    if (result.rows.length === 0) {
      return res.json({ goals: {} });
    }

    res.json({ goals: result.rows[0].goals_data });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Failed to get goals' });
  }
});

// Save/update user's goals for a specific year
router.put('/:year', verifyToken, async (req, res) => {
  const { year } = req.params;
  const { uid } = req.user;
  const { goals } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO goals (firebase_uid, year, goals_data)
       VALUES ($1, $2, $3)
       ON CONFLICT (firebase_uid, year)
       DO UPDATE SET goals_data = $3, updated_at = NOW()
       RETURNING *`,
      [uid, year, JSON.stringify(goals)]
    );

    res.json({ 
      message: 'Goals saved successfully',
      goals: result.rows[0].goals_data
    });
  } catch (error) {
    console.error('Save goals error:', error);
    res.status(500).json({ error: 'Failed to save goals' });
  }
});

// Delete user's goals for a specific year
router.delete('/:year', verifyToken, async (req, res) => {
  const { year } = req.params;
  const { uid } = req.user;

  try {
    await pool.query(
      'DELETE FROM goals WHERE firebase_uid = $1 AND year = $2',
      [uid, year]
    );

    res.json({ message: 'Goals deleted successfully' });
  } catch (error) {
    console.error('Delete goals error:', error);
    res.status(500).json({ error: 'Failed to delete goals' });
  }
});

module.exports = router;