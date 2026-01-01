import React from 'react';
import { useWizard } from '../../context/WizardContext';
import { useAuth } from '../../context/AuthContext';
import './WizardSteps.css';

const VisionTransitionStep = () => {
  const { nextStep, answers } = useWizard();
  const { user } = useAuth();

  const firstName = user?.displayName?.split(' ')[0] || 'friend';

  // Count reflections
  const totalReflections = [
    ...(answers.whatDidntWork || []),
    ...(answers.wishedMoreTimeFor || [])
  ].length;

  return (
    <div className="step-container">
      <div className="step-emoji-wrapper">
        <span className="step-emoji sparkle">🌟</span>
      </div>

      <h1 className="step-title">That's clarity, {firstName}</h1>
      
      {totalReflections > 0 && (
        <p className="celebration-count">
          You identified <span className="highlight-number">{totalReflections}</span> {totalReflections === 1 ? 'thing' : 'things'} to work on
        </p>
      )}

      <p className="step-subtitle">
        You know what worked. You know what didn't.<br />
        Now let's dream about who you want to become.
      </p>

      <p className="step-subtitle" style={{ marginTop: 'var(--space-md)', fontStyle: 'italic' }}>
        2026 is a blank page — what's the story you want to write?
      </p>
      
      <button className="step-button" onClick={nextStep}>
        Let's dream →
      </button>
    </div>
  );
};

export default VisionTransitionStep;