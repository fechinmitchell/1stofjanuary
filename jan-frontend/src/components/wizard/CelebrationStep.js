import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWizard } from '../../context/WizardContext';
import { useAuth } from '../../context/AuthContext';
import './WizardSteps.css';

const CelebrationStep = () => {
  const { nextStep, answers } = useWizard();
  const { user } = useAuth();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [showConfetti, setShowConfetti] = useState(true);

  const firstName = user?.displayName?.split(' ')[0] || 'friend';

  // Count how many things they added
  const totalMemories = [
    ...(answers.travelMemory || []),
    ...(answers.bigMoment || []),
    ...(answers.quietJoy || []),
    ...(answers.habitsThatStuck || []),
    ...(answers.personWhoMadeYear || [])
  ].length;

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    
    const timer = setTimeout(() => setShowConfetti(false), 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="step-container celebration-step">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={400}
          colors={['#FF6B6B', '#FFE66D', '#4ECDC4', '#45B7D1', '#A78BFA', '#FBBF77']}
        />
      )}
      
      <div className="step-emoji-wrapper">
        <span className="step-emoji celebration">🎊</span>
      </div>

      <h1 className="step-title">What a year, {firstName}!</h1>
      
      {totalMemories > 0 && (
        <p className="celebration-count">
          You captured <span className="highlight-number">{totalMemories}</span> amazing {totalMemories === 1 ? 'memory' : 'memories'}
        </p>
      )}

      <p className="step-subtitle">
        You travelled, you grew, you showed up.<br />
        2025 was really something special.
      </p>

      <p className="step-subtitle" style={{ marginTop: 'var(--space-md)' }}>
        Now let's get honest about what comes next...
      </p>
      
      <button className="step-button" onClick={nextStep}>
        I'm ready to reflect →
      </button>
    </div>
  );
};

export default CelebrationStep;