import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWizard } from '../../context/WizardContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './WizardSteps.css';

const FinalCelebrationStep = () => {
  const { answers } = useWizard();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [showConfetti, setShowConfetti] = useState(true);

  const firstName = user?.displayName?.split(' ')[0] || 'friend';

  // Count everything
  const totalItems = Object.values(answers).reduce((total, value) => {
    if (Array.isArray(value)) {
      return total + value.length;
    }
    return total;
  }, 0);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    
    const timer = setTimeout(() => setShowConfetti(false), 8000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const handleViewDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="step-container final-celebration-step">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={600}
          colors={['#FF6B6B', '#FFE66D', '#4ECDC4', '#45B7D1', '#A78BFA', '#FBBF77']}
        />
      )}
      
      <div className="step-emoji-wrapper">
        <span className="step-emoji celebration">🎉</span>
      </div>

      <h1 className="step-title final-title">You did it, {firstName}!</h1>
      
      {totalItems > 0 && (
        <p className="celebration-count">
          You've set <span className="highlight-number">{totalItems}</span> intentions for 2026
        </p>
      )}

      <p className="step-subtitle">
        Your year is officially planned.<br />
        This is going to be your best one yet.
      </p>

      <div className="final-stats">
        <div className="final-stat">
          <span className="final-stat-emoji">✨</span>
          <span className="final-stat-text">Memories captured</span>
        </div>
        <div className="final-stat">
          <span className="final-stat-emoji">🎯</span>
          <span className="final-stat-text">Goals set</span>
        </div>
        <div className="final-stat">
          <span className="final-stat-emoji">🦋</span>
          <span className="final-stat-text">Vision created</span>
        </div>
      </div>
      
      <button className="step-button" onClick={handleViewDashboard}>
        View my 2026 dashboard →
      </button>

      <p className="final-reminder">
        We'll keep your goals safe. Come back anytime to check in on your progress.
      </p>
    </div>
  );
};

export default FinalCelebrationStep;