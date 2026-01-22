const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get the Firebase auth token
const getAuthToken = async () => {
  const { auth } = await import('../firebase');
  const user = auth.currentUser;
  if (user) {
    return user.getIdToken();
  }
  return null;
};

// API helper with auth
const apiRequest = async (endpoint, options = {}) => {
  const token = await getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle capacity_full error specifically
  if (response.status === 403) {
    const error = await response.json();
    if (error.error === 'capacity_full') {
      const capacityError = new Error(error.message);
      capacityError.isCapacityFull = true;
      capacityError.shouldShowWaitlist = true;
      throw capacityError;
    }
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
};

// Public API helper (no auth needed)
const publicApiRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
};

// ============================================
// AUTH API
// ============================================
export const syncUser = () => apiRequest('/auth/sync', { method: 'POST' });
export const getMe = () => apiRequest('/auth/me');
export const checkUserExists = (firebaseUid) => publicApiRequest(`/auth/check/${firebaseUid}`);

// ============================================
// GOALS API
// ============================================
export const getGoals = (year) => apiRequest(`/goals/${year}`);
export const saveGoals = (year, goals) => apiRequest(`/goals/${year}`, {
  method: 'PUT',
  body: JSON.stringify({ goals }),
});
export const deleteGoals = (year) => apiRequest(`/goals/${year}`, {
  method: 'DELETE',
});

// ============================================
// NOTIFY API
// ============================================
export const subscribeNotify = (email, type) => apiRequest('/notify/subscribe', {
  method: 'POST',
  body: JSON.stringify({ email, type }),
});

// ============================================
// CAPACITY API (Public)
// ============================================
export const getCapacityStatus = () => publicApiRequest('/capacity/status');
export const getWaitlistCount = () => publicApiRequest('/capacity/waitlist/count');
export const joinWaitlist = (email) => publicApiRequest('/capacity/waitlist/join', {
  method: 'POST',
  body: JSON.stringify({ email }),
});
export const checkWaitlistStatus = (email) => publicApiRequest(`/capacity/waitlist/check/${email}`);

// ============================================
// CAPACITY API (Admin - requires auth)
// ============================================
export const getAdminStats = () => apiRequest('/capacity/admin/stats');
export const updateCapacitySettings = (maxUsers, isOpen) => apiRequest('/capacity/settings', {
  method: 'PUT',
  body: JSON.stringify({ maxUsers, isOpen }),
});
export const getWaitlistEmails = (limit = 50) => apiRequest(`/capacity/waitlist/emails?limit=${limit}`);
export const markWaitlistNotified = (emails) => apiRequest('/capacity/waitlist/notify', {
  method: 'POST',
  body: JSON.stringify({ emails }),
});