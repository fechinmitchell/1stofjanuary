import React, { useState, useEffect } from 'react';
import './WizardSteps.css';

const TransitionMessage = ({ emoji, message, subMessage, onComplete }) => {
  const [stage, setStage] = useState('entering'); // entering, visible, exiting

  useEffect(() => {
    // Enter animation
    const visibleTimer = setTimeout(() => {
      setStage('visible');
    }, 100);

    // Start exit after 2 seconds
    const exitTimer = setTimeout(() => {
      setStage('exiting');
    }, 2000);

    // Complete after exit animation
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(visibleTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`transition-message ${stage}`}>
      <div className="transition-content">
        <span className="transition-emoji">{emoji}</span>
        <h2 className="transition-text">{message}</h2>
        {subMessage && <p className="transition-subtext">{subMessage}</p>}
      </div>
    </div>
  );
};

export default TransitionMessage;