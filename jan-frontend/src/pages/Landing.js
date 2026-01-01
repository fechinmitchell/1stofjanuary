import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const { user, loading, loginWithGoogle } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleGetStarted = () => {
    setShowAuthModal(true);
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoggingIn(true);
      const loggedInUser = await loginWithGoogle();
      
      // Check if user has existing goals in localStorage
      const savedAnswers = localStorage.getItem(`wizard_answers_${loggedInUser.uid}`);
      const hasExistingGoals = savedAnswers && Object.keys(JSON.parse(savedAnswers)).length > 0;
      
      if (hasExistingGoals) {
        navigate('/dashboard');
      } else {
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
        >
          Let's Plan 2026 →
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

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="auth-modal-close" onClick={() => setShowAuthModal(false)}>×</button>
            
            <div className="auth-modal-icon">🎯</div>
            <h2 className="auth-modal-title">Let's save your progress</h2>
            <p className="auth-modal-subtitle">
              Sign in so your goals are safe and waiting for you ✨
            </p>

            <button 
              className="auth-google-btn"
              onClick={handleGoogleSignIn}
              disabled={isLoggingIn}
            >
              <svg viewBox="0 0 24 24" className="google-icon">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isLoggingIn ? 'Signing in...' : 'Continue with Google'}
            </button>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <button className="auth-email-btn" disabled>
              ✉️ Continue with Email
              <span className="coming-soon-badge">Coming Soon</span>
            </button>

            <p className="auth-modal-footer">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;