import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWizard } from '../../context/WizardContext';
import './WizardSteps.css';

const WelcomeStep = () => {
  const { user } = useAuth();
  const { nextStep } = useWizard();
  
  const firstName = user?.displayName?.split(' ')[0] || 'friend';

  return (
    <div className="step-container">
      <span className="step-emoji">👋</span>
      <h1 className="step-title">Hey {firstName}!</h1>
      <p className="step-subtitle">
        This takes about 5 minutes.<br />
        And it might just change your year.
      </p>
      <button className="step-button" onClick={nextStep}>
        Let's go →
      </button>
    </div>
  );
};

export default WelcomeStep;