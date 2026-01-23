const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS configuration - allow multiple origins
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:3000'];

// Always include localhost for development testing
// This allows you to test locally even when FRONTEND_URL is set to production URLs
const localhostOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001'
];

localhostOrigins.forEach(origin => {
  if (!allowedOrigins.includes(origin)) {
    allowedOrigins.push(origin);
  }
});

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const goalsRoutes = require('./routes/goals');
const notifyRoutes = require('./routes/notify');
const capacityRoutes = require('./routes/capacity');

app.use('/api/auth', authRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/notify', notifyRoutes);
app.use('/api/capacity', capacityRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: '1st of January API',
    timestamp: new Date().toISOString(),
    allowedOrigins: allowedOrigins
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ Allowed origins:`, allowedOrigins);
});