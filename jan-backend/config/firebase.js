const admin = require('firebase-admin');

// Initialize Firebase Admin
// In production, use environment variable for service account
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  // For local development, use application default credentials
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID
  });
}

module.exports = admin;