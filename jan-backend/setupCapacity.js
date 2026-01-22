require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const setupCapacity = async () => {
  console.log('🔧 Setting up capacity tables...\n');

  try {
    // Capacity settings table (single row)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS capacity_settings (
        id INTEGER PRIMARY KEY DEFAULT 1,
        max_users INTEGER NOT NULL DEFAULT 100,
        is_open BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT single_row CHECK (id = 1)
      )
    `);
    console.log('✅ Capacity settings table created');

    // Insert default settings if not exists (start with 50 users to be safe)
    await pool.query(`
      INSERT INTO capacity_settings (id, max_users, is_open)
      VALUES (1, 50, true)
      ON CONFLICT (id) DO NOTHING
    `);
    console.log('✅ Default capacity settings inserted (50 users)');

    // Waitlist table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS waitlist (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        notified BOOLEAN DEFAULT false,
        notified_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Waitlist table created');

    // Add index for waitlist
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email)
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_waitlist_notified ON waitlist(notified)
    `);
    console.log('✅ Waitlist indexes created');

    // Add is_active column to users table if it doesn't exist
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true
    `);
    console.log('✅ Added is_active column to users table');

    console.log('\n🎉 Capacity setup complete!');
    
    // Show current stats
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const settings = await pool.query('SELECT * FROM capacity_settings WHERE id = 1');
    
    console.log('\n📊 Current Status:');
    console.log(`   Current Users: ${userCount.rows[0].count}`);
    console.log(`   Max Users: ${settings.rows[0]?.max_users || 50}`);
    console.log(`   Is Open: ${settings.rows[0]?.is_open ?? true}`);
    
  } catch (error) {
    console.error('❌ Capacity setup error:', error.message);
  } finally {
    await pool.end();
  }
};

setupCapacity();