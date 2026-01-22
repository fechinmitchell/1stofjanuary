const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const verifyToken = require('../middleware/auth');

// Check if there's capacity for new users (public endpoint)
router.get('/status', async (req, res) => {
  try {
    // Get current user count
    const userCountResult = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE is_active = true'
    );
    const currentUsers = parseInt(userCountResult.rows[0].count);

    // Get capacity settings
    const settingsResult = await pool.query(
      'SELECT * FROM capacity_settings WHERE id = 1'
    );
    
    // Default settings if none exist
    let settings = { max_users: 50, is_open: true };
    if (settingsResult.rows.length > 0) {
      settings = settingsResult.rows[0];
    }

    const hasCapacity = settings.is_open && currentUsers < settings.max_users;
    const spotsRemaining = Math.max(0, settings.max_users - currentUsers);

    res.json({
      hasCapacity,
      spotsRemaining,
      isOpen: settings.is_open,
      // Don't expose exact numbers, just categories
      capacityStatus: spotsRemaining > 20 ? 'plenty' : spotsRemaining > 5 ? 'limited' : spotsRemaining > 0 ? 'almost_full' : 'full'
    });
  } catch (error) {
    console.error('Capacity check error:', error);
    // Default to open if there's an error (fail open)
    res.json({ hasCapacity: true, capacityStatus: 'unknown' });
  }
});

// Get waitlist count (public)
router.get('/waitlist/count', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM waitlist WHERE notified = false'
    );
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('Waitlist count error:', error);
    res.json({ count: 0 });
  }
});

// Join waitlist (public)
router.post('/waitlist/join', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    // Check if already a user
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    
    if (existingUser.rows.length > 0) {
      return res.json({ 
        message: 'You already have an account! Try signing in.',
        alreadyUser: true 
      });
    }

    // Add to waitlist
    const result = await pool.query(
      `INSERT INTO waitlist (email)
       VALUES ($1)
       ON CONFLICT (email) DO NOTHING
       RETURNING *`,
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.json({ 
        message: "You're already on the waitlist! We'll notify you soon.",
        alreadyWaitlisted: true 
      });
    }

    // Get position in waitlist
    const positionResult = await pool.query(
      `SELECT COUNT(*) as position FROM waitlist 
       WHERE created_at <= $1 AND notified = false`,
      [result.rows[0].created_at]
    );

    res.json({ 
      message: "You're on the list! We'll email you when spots open up.",
      position: parseInt(positionResult.rows[0].position),
      success: true
    });
  } catch (error) {
    console.error('Waitlist join error:', error);
    res.status(500).json({ error: 'Failed to join waitlist' });
  }
});

// Check if email is on waitlist (public)
router.get('/waitlist/check/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM waitlist WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.json({ onWaitlist: false });
    }

    // Get position
    const positionResult = await pool.query(
      `SELECT COUNT(*) as position FROM waitlist 
       WHERE created_at <= $1 AND notified = false`,
      [result.rows[0].created_at]
    );

    res.json({ 
      onWaitlist: true,
      position: parseInt(positionResult.rows[0].position),
      notified: result.rows[0].notified
    });
  } catch (error) {
    console.error('Waitlist check error:', error);
    res.status(500).json({ error: 'Failed to check waitlist' });
  }
});

// ============================================
// ADMIN ENDPOINTS (protected)
// ============================================

// Update capacity settings
router.put('/settings', verifyToken, async (req, res) => {
  const { maxUsers, isOpen } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO capacity_settings (id, max_users, is_open, updated_at)
       VALUES (1, $1, $2, NOW())
       ON CONFLICT (id) 
       DO UPDATE SET max_users = $1, is_open = $2, updated_at = NOW()
       RETURNING *`,
      [maxUsers || 50, isOpen !== false]
    );

    res.json({ 
      message: 'Settings updated',
      settings: result.rows[0]
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Get admin stats
router.get('/admin/stats', verifyToken, async (req, res) => {
  try {
    const [users, settings, waitlist] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM users WHERE is_active = true'),
      pool.query('SELECT * FROM capacity_settings WHERE id = 1'),
      pool.query('SELECT COUNT(*) as count FROM waitlist WHERE notified = false')
    ]);

    res.json({
      currentUsers: parseInt(users.rows[0].count),
      maxUsers: settings.rows[0]?.max_users || 50,
      isOpen: settings.rows[0]?.is_open ?? true,
      waitlistCount: parseInt(waitlist.rows[0].count)
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// Get waitlist emails (for sending notifications)
router.get('/waitlist/emails', verifyToken, async (req, res) => {
  const { limit = 50 } = req.query;

  try {
    const result = await pool.query(
      `SELECT email, created_at FROM waitlist 
       WHERE notified = false 
       ORDER BY created_at ASC 
       LIMIT $1`,
      [parseInt(limit)]
    );

    res.json({ emails: result.rows });
  } catch (error) {
    console.error('Get waitlist emails error:', error);
    res.status(500).json({ error: 'Failed to get emails' });
  }
});

// Mark waitlist entries as notified
router.post('/waitlist/notify', verifyToken, async (req, res) => {
  const { emails, count } = req.body;

  try {
    let result;
    
    if (emails && emails.length > 0) {
      result = await pool.query(
        `UPDATE waitlist 
         SET notified = true, notified_at = NOW()
         WHERE email = ANY($1) AND notified = false
         RETURNING email`,
        [emails.map(e => e.toLowerCase())]
      );
    } else if (count) {
      result = await pool.query(
        `UPDATE waitlist 
         SET notified = true, notified_at = NOW()
         WHERE id IN (
           SELECT id FROM waitlist 
           WHERE notified = false 
           ORDER BY created_at ASC 
           LIMIT $1
         )
         RETURNING email`,
        [count]
      );
    } else {
      return res.status(400).json({ error: 'Provide emails array or count' });
    }

    res.json({ 
      message: `Marked ${result.rows.length} as notified`,
      emails: result.rows.map(r => r.email)
    });
  } catch (error) {
    console.error('Notify waitlist error:', error);
    res.status(500).json({ error: 'Failed to update waitlist' });
  }
});

module.exports = router;