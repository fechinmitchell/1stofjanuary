import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

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
          onClick={() => navigate('/auth')}
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
    </div>
  );
};

export default Landing;