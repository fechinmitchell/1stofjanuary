import React from 'react';
import { useWizard } from '../../context/WizardContext';
import './WizardSteps.css';

const IntroStep = () => {
  const { nextStep } = useWizard();

  return (
    <div className="step-container">
      <span className="step-emoji">✨</span>
      <h1 className="step-title">Let's look back at 2025</h1>
      <p className="step-subtitle">
        What a year it was.<br />
        Let's celebrate everything it brought you.
      </p>
      <button className="step-button" onClick={nextStep}>
        I'm ready →
      </button>
    </div>
  );
};

export default IntroStep;