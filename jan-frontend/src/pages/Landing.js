import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const { user, loading, loginWithGoogle } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleGetStarted = async () => {
    try {
      setIsLoggingIn(true);
      const loggedInUser = await loginWithGoogle();
      
      // Check if user has existing goals in localStorage
      const savedAnswers = localStorage.getItem(`wizard_answers_${loggedInUser.uid}`);
      const hasExistingGoals = savedAnswers && Object.keys(JSON.parse(savedAnswers)).length > 0;
      
      if (hasExistingGoals) {
        // Returning user - go to dashboard
        navigate('/dashboard');
      } else {
        // New user - go to wizard
        navigate('/wizard');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="landing">
        <div className="landing-content">
          <div style={{ fontSize: '3rem' }}>🎯</div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="landing">
      <div className="landing-content">
        <span className="landing-badge">✨ New Year, New Plans</span>
        <h1 className="landing-title">
          2026 is going to be <span className="highlight">your year</span>
        </h1>
        <p className="landing-subtitle">
          Let's make sure of it. Plan your best year yet in just 5 minutes.
        </p>
        <button 
          className="landing-cta"
          onClick={handleGetStarted}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? 'Signing in...' : "Let's Plan 2026 →"}
        </button>
        <p className="landing-hint">
          Fun, easy, and actually useful. Promise.
        </p>
      </div>
      <div className="landing-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
    </div>
  );
};

export default Landing;