const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const verifyToken = require('../middleware/auth');

// Helper to check capacity
const checkCapacity = async () => {
  const [userCount, settings] = await Promise.all([
    pool.query('SELECT COUNT(*) as count FROM users WHERE is_active = true'),
    pool.query('SELECT * FROM capacity_settings WHERE id = 1')
  ]);

  const currentUsers = parseInt(userCount.rows[0].count);
  const maxUsers = settings.rows[0]?.max_users || 50;
  const isOpen = settings.rows[0]?.is_open ?? true;

  return {
    hasCapacity: isOpen && currentUsers < maxUsers,
    currentUsers,
    maxUsers,
    isOpen
  };
};

// Sync user to database after login
router.post('/sync', verifyToken, async (req, res) => {
  const { uid, email, name } = req.user;

  try {
    // First check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE firebase_uid = $1',
      [uid]
    );

    // If user exists, just update and return - ALWAYS ALLOWED
    if (existingUser.rows.length > 0) {
      const result = await pool.query(
        `UPDATE users 
         SET email = $2, name = $3, updated_at = NOW()
         WHERE firebase_uid = $1
         RETURNING *`,
        [uid, email, name]
      );

      return res.json({ 
        message: 'User synced successfully',
        user: result.rows[0],
        isNewUser: false
      });
    }

    // NEW USER - check capacity
    const capacity = await checkCapacity();
    
    if (!capacity.hasCapacity) {
      // No capacity for new users
      return res.status(403).json({ 
        error: 'capacity_full',
        message: 'We\'re at capacity right now. Join the waitlist to be notified when spots open up!',
        shouldShowWaitlist: true
      });
    }

    // Has capacity - create new user
    const result = await pool.query(
      `INSERT INTO users (firebase_uid, email, name, is_active)
       VALUES ($1, $2, $3, true)
       RETURNING *`,
      [uid, email, name]
    );

    res.json({ 
      message: 'User synced successfully',
      user: result.rows[0],
      isNewUser: true
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

// Check if user exists (before they try to sign up)
router.get('/check/:firebaseUid', async (req, res) => {
  const { firebaseUid } = req.params;

  try {
    const result = await pool.query(
      'SELECT id, is_active FROM users WHERE firebase_uid = $1',
      [firebaseUid]
    );

    res.json({ 
      exists: result.rows.length > 0,
      isActive: result.rows[0]?.is_active ?? false
    });
  } catch (error) {
    console.error('Check user error:', error);
    res.json({ exists: false, isActive: false });
  }
});

module.exports = router;