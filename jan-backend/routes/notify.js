const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Subscribe to notifications (no auth required)
router.post('/subscribe', async (req, res) => {
  const { email, type } = req.body;

  // Validate
  if (!email || !type) {
    return res.status(400).json({ error: 'Email and type are required' });
  }

  const validTypes = ['2027_goals', 'vision_board'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: 'Invalid notification type' });
  }

  try {
    // Upsert subscription
    const result = await pool.query(
      `INSERT INTO notify_signups (email, notify_type)
       VALUES ($1, $2)
       ON CONFLICT (email, notify_type) DO NOTHING
       RETURNING *`,
      [email.toLowerCase(), type]
    );

    if (result.rows.length === 0) {
      return res.json({ message: 'Already subscribed!', alreadySubscribed: true });
    }

    res.json({ 
      message: 'Successfully subscribed!',
      subscription: result.rows[0]
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// Get subscription count (for admin/stats)
router.get('/stats', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT notify_type, COUNT(*) as count 
       FROM notify_signups 
       GROUP BY notify_type`
    );

    res.json({ stats: result.rows });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

module.exports = router;