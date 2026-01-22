import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Wizard from './pages/Wizard';
import Dashboard from './pages/Dashboard';
import Waitlist from './pages/Waitlist';
import './styles/variables.css';
import './styles/global.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading, capacityError } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FFF6F0 0%, #F0F9FF 50%, #F5F0FF 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
          <p style={{ color: '#666' }}>Loading...</p>
        </div>
      </div>
    );
  }
  
  // If capacity error, redirect to waitlist
  if (capacityError) {
    return <Navigate to="/waitlist" />;
  }
  
  if (!user) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/waitlist" element={<Waitlist />} />
      <Route 
        path="/wizard" 
        element={
          <ProtectedRoute>
            <Wizard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;