const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const verifyToken = require('../middleware/auth');

// Sync user to database after login
router.post('/sync', verifyToken, async (req, res) => {
  const { uid, email, name } = req.user;

  try {
    // Upsert user
    const result = await pool.query(
      `INSERT INTO users (firebase_uid, email, name)
       VALUES ($1, $2, $3)
       ON CONFLICT (firebase_uid) 
       DO UPDATE SET email = $2, name = $3, updated_at = NOW()
       RETURNING *`,
      [uid, email, name]
    );

    res.json({ 
      message: 'User synced successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('User sync error:', error);
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

// Get current user
router.get('/me', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE firebase_uid = $1',
      [req.user.uid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

module.exports = router;