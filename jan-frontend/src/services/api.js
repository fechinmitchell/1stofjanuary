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

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
};

// Auth API
export const syncUser = () => apiRequest('/auth/sync', { method: 'POST' });
export const getMe = () => apiRequest('/auth/me');

// Goals API
export const getGoals = (year) => apiRequest(`/goals/${year}`);
export const saveGoals = (year, goals) => apiRequest(`/goals/${year}`, {
  method: 'PUT',
  body: JSON.stringify({ goals }),
});
export const deleteGoals = (year) => apiRequest(`/goals/${year}`, {
  method: 'DELETE',
});

// Notify API
export const subscribeNotify = (email, type) => apiRequest('/notify/subscribe', {
  method: 'POST',
  body: JSON.stringify({ email, type }),
});