require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const setupDatabase = async () => {
  console.log('🔧 Setting up database...\n');

  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        firebase_uid VARCHAR(128) UNIQUE NOT NULL,
        email VARCHAR(255),
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');

    // Goals table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS goals (
        id SERIAL PRIMARY KEY,
        firebase_uid VARCHAR(128) NOT NULL,
        year INTEGER NOT NULL,
        goals_data JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(firebase_uid, year)
      )
    `);
    console.log('✅ Goals table created');

    // Notify signups table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notify_signups (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        notify_type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(email, notify_type)
      )
    `);
    console.log('✅ Notify signups table created');

    // Indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_goals_firebase_uid ON goals(firebase_uid)
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_goals_year ON goals(year)
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_notify_type ON notify_signups(notify_type)
    `);
    console.log('✅ Indexes created');

    console.log('\n🎉 Database setup complete!');
  } catch (error) {
    console.error('❌ Database setup error:', error.message);
  } finally {
    await pool.end();
  }
};

setupDatabase();