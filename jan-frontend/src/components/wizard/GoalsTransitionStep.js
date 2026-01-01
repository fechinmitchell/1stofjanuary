import React from 'react';
import { useWizard } from '../../context/WizardContext';
import { useAuth } from '../../context/AuthContext';
import './WizardSteps.css';

const GoalsTransitionStep = () => {
  const { nextStep, answers } = useWizard();
  const { user } = useAuth();

  const firstName = user?.displayName?.split(' ')[0] || 'friend';

  // Count vision items
  const totalVision = [
    ...(answers.kindOfPerson || []),
    ...(answers.perfectDay || []),
    ...(answers.wantToExperience || [])
  ].length;

  return (
    <div className="step-container">
      <div className="step-emoji-wrapper">
        <span className="step-emoji target">🎯</span>
      </div>

      <h1 className="step-title">Love the vision, {firstName}!</h1>
      
      {totalVision > 0 && (
        <p className="celebration-count">
          You've painted a picture with <span className="highlight-number">{totalVision}</span> {totalVision === 1 ? 'dream' : 'dreams'}
        </p>
      )}

      <p className="step-subtitle">
        You know who you want to be.<br />
        You know how you want to feel.
      </p>

      <p className="step-subtitle" style={{ marginTop: 'var(--space-md)', fontWeight: '600' }}>
        Now let's turn that into real goals.
      </p>
      
      <button className="step-button" onClick={nextStep}>
        Let's set some goals →
      </button>
    </div>
  );
};

export default GoalsTransitionStep;