import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { WizardProvider, useWizard } from '../context/WizardContext';
import TransitionMessage from '../components/wizard/TransitionMessage';
import './Wizard.css';

// Step components
import WelcomeStep from '../components/wizard/WelcomeStep';
import TravelMemoryStep from '../components/wizard/TravelMemoryStep';
import BigMomentStep from '../components/wizard/BigMomentStep';
import QuietJoyStep from '../components/wizard/QuietJoyStep';
import HabitsStuckStep from '../components/wizard/HabitsStuckStep';
import PersonMadeYearStep from '../components/wizard/PersonMadeYearStep';
import CelebrationStep from '../components/wizard/CelebrationStep';
import WhatDidntWorkStep from '../components/wizard/WhatDidntWorkStep';
import WishedMoreTimeStep from '../components/wizard/WishedMoreTimeStep';
import VisionTransitionStep from '../components/wizard/VisionTransitionStep';
import KindOfPersonStep from '../components/wizard/KindOfPersonStep';
import PerfectDayStep from '../components/wizard/PerfectDayStep';
import WantToExperienceStep from '../components/wizard/WantToExperienceStep';
import GoalsTransitionStep from '../components/wizard/GoalsTransitionStep';
import GoalsDreamsStep from '../components/wizard/GoalsDreamsStep';
import PlaceToVisitStep from '../components/wizard/PlaceToVisitStep';
import HabitToBuildStep from '../components/wizard/HabitToBuildStep';
import SavingForStep from '../components/wizard/SavingForStep';
import FinalCelebrationStep from '../components/wizard/FinalCelebrationStep';

const steps = [
  { 
    component: WelcomeStep, 
    key: 'welcome',
    label: 'Welcome',
    emoji: '👋',
    section: 'start',
    transition: null 
  },
  { 
    component: TravelMemoryStep, 
    key: 'travel-memory',
    label: 'Travel',
    emoji: '✈️',
    section: 'reflect',
    transition: {
      emoji: '✨',
      message: "Before we plan your 2026...",
      subMessage: "Let's look back and reflect on the year that was"
    }
  },
  { 
    component: BigMomentStep, 
    key: 'big-moment',
    label: 'Big Moments',
    emoji: '🎯',
    section: 'reflect',
    transition: {
      emoji: '🎯',
      message: "Now the big stuff",
      subMessage: "Those moments that changed everything"
    }
  },
  { 
    component: QuietJoyStep, 
    key: 'quiet-joy',
    label: 'Quiet Joy',
    emoji: '🌸',
    section: 'reflect',
    transition: {
      emoji: '🌸',
      message: "What about the quiet moments?",
      subMessage: "Sometimes the small things mean the most"
    }
  },
  { 
    component: HabitsStuckStep, 
    key: 'habits-stuck',
    label: 'Habits',
    emoji: '💪',
    section: 'reflect',
    transition: {
      emoji: '💪',
      message: "Let's talk habits",
      subMessage: "The things you actually stuck with this year"
    }
  },
  { 
    component: PersonMadeYearStep, 
    key: 'person-made-year',
    label: 'People',
    emoji: '❤️',
    section: 'reflect',
    transition: {
      emoji: '❤️',
      message: "The people in your life",
      subMessage: "Who made 2025 brighter?"
    }
  },
  { 
    component: CelebrationStep, 
    key: 'celebration',
    label: 'Celebrate',
    emoji: '🎉',
    section: 'reflect',
    transition: null
  },
  { 
    component: WhatDidntWorkStep, 
    key: 'what-didnt-work',
    label: "Didn't Work",
    emoji: '🪞',
    section: 'honest',
    transition: {
      emoji: '🪞',
      message: "Time for some honesty",
      subMessage: "No judgment — just clarity"
    }
  },
  { 
    component: WishedMoreTimeStep, 
    key: 'wished-more-time',
    label: 'More Time',
    emoji: '⏰',
    section: 'honest',
    transition: {
      emoji: '⏰',
      message: "If only there were more hours...",
      subMessage: "What deserved more of your time?"
    }
  },
  { 
    component: VisionTransitionStep, 
    key: 'vision-transition',
    label: 'Vision',
    emoji: '🔮',
    section: 'vision',
    transition: null
  },
  { 
    component: KindOfPersonStep, 
    key: 'kind-of-person',
    label: 'Become',
    emoji: '🦋',
    section: 'vision',
    transition: {
      emoji: '🦋',
      message: "Now let's dream",
      subMessage: "Who do you want to become?"
    }
  },
  { 
    component: PerfectDayStep, 
    key: 'perfect-day',
    label: 'Perfect Day',
    emoji: '☀️',
    section: 'vision',
    transition: {
      emoji: '☀️',
      message: "Picture this...",
      subMessage: "Your perfect ordinary day in 2026"
    }
  },
  { 
    component: WantToExperienceStep, 
    key: 'want-to-experience',
    label: 'Experience',
    emoji: '🌈',
    section: 'vision',
    transition: {
      emoji: '🌈',
      message: "What's calling you?",
      subMessage: "The experiences you're craving"
    }
  },
  { 
    component: GoalsTransitionStep, 
    key: 'goals-transition',
    label: 'Goals Intro',
    emoji: '🎯',
    section: 'goals',
    transition: null
  },
  { 
    component: GoalsDreamsStep, 
    key: 'goals-dreams',
    label: 'Dreams',
    emoji: '🚀',
    section: 'goals',
    transition: {
      emoji: '🚀',
      message: "Let's make it real",
      subMessage: "Time to set some goals"
    }
  },
  { 
    component: PlaceToVisitStep, 
    key: 'place-to-visit',
    label: 'Places',
    emoji: '🗺️',
    section: 'goals',
    transition: {
      emoji: '🗺️',
      message: "Adventure awaits",
      subMessage: "Where will 2026 take you?"
    }
  },
  { 
    component: HabitToBuildStep, 
    key: 'habit-to-build',
    label: 'New Habits',
    emoji: '🔄',
    section: 'goals',
    transition: {
      emoji: '🔄',
      message: "Small steps, big changes",
      subMessage: "What habit will transform your year?"
    }
  },
  { 
    component: SavingForStep, 
    key: 'saving-for',
    label: 'Savings',
    emoji: '💰',
    section: 'goals',
    transition: {
      emoji: '💰',
      message: "Worth saving for",
      subMessage: "What gets you excited to save?"
    }
  },
  { 
    component: FinalCelebrationStep, 
    key: 'final-celebration',
    label: 'Complete!',
    emoji: '🎉',
    section: 'finish',
    transition: {
      emoji: '🎉',
      message: "You did it!",
      subMessage: "2026 is officially planned"
    }
  }
];

// Section definitions for grouping
const sections = [
  { id: 'start', label: 'Start', color: 'var(--mint)' },
  { id: 'reflect', label: 'Reflect', color: 'var(--coral)' },
  { id: 'honest', label: 'Honest', color: 'var(--lavender)' },
  { id: 'vision', label: 'Vision', color: 'var(--sky)' },
  { id: 'goals', label: 'Goals', color: 'var(--sunshine)' },
  { id: 'finish', label: 'Finish', color: 'var(--mint)' }
];

const WizardContent = () => {
  const { currentStep, goToStep, answers, hasGoals } = useWizard();
  const navigate = useNavigate();
  const [showTransition, setShowTransition] = useState(false);
  const [lastStep, setLastStep] = useState(-1);
  const [showProgress, setShowProgress] = useState(false);

  // Track highest step visited for navigation
  const [highestVisited, setHighestVisited] = useState(0);

  React.useEffect(() => {
    if (currentStep > highestVisited) {
      setHighestVisited(currentStep);
    }
  }, [currentStep, highestVisited]);

  // Check if we need to show transition
  React.useEffect(() => {
    if (currentStep > lastStep && steps[currentStep]?.transition) {
      setShowTransition(true);
    }
    setLastStep(currentStep);
  }, [currentStep, lastStep]);

  // If we've gone past all steps, go to dashboard
  if (currentStep >= steps.length) {
    navigate('/dashboard');
    return null;
  }

  const currentStepData = steps[currentStep];
  const CurrentStepComponent = currentStepData.component;

  const handleTransitionComplete = () => {
    setShowTransition(false);
  };

  const handleStepClick = (index) => {
    // Can only navigate to visited steps or next step
    if (index <= highestVisited + 1) {
      goToStep(index);
      setShowProgress(false);
    }
  };

  const isStepCompleted = (index) => {
    return index < currentStep;
  };

  const isStepAccessible = (index) => {
    return index <= highestVisited + 1;
  };

  // Get current section
  const currentSection = sections.find(s => s.id === currentStepData.section);

  return (
    <div className="wizard">
      {/* Header with progress */}
      <header className="wizard-header">
        <button 
          className="wizard-home-btn"
          onClick={() => navigate('/')}
          title="Back to home"
        >
          <span className="wizard-home-icon">🏠</span>
          <span className="wizard-home-text">Home</span>
        </button>

        <div className="wizard-progress-container">
          <button 
            className="wizard-progress-toggle"
            onClick={() => setShowProgress(!showProgress)}
          >
            <span className="progress-current-emoji">{currentStepData.emoji}</span>
            <span className="progress-current-label">{currentStepData.label}</span>
            <span className="progress-step-count">{currentStep + 1}/{steps.length}</span>
            <span className={`progress-chevron ${showProgress ? 'open' : ''}`}>▼</span>
          </button>

          {/* Mini progress dots (always visible) */}
          <div className="wizard-mini-progress">
            {steps.map((step, index) => (
              <div
                key={step.key}
                className={`mini-dot ${index === currentStep ? 'active' : ''} ${isStepCompleted(index) ? 'completed' : ''}`}
                style={{ 
                  backgroundColor: index === currentStep 
                    ? sections.find(s => s.id === step.section)?.color 
                    : undefined 
                }}
              />
            ))}
          </div>
        </div>

        {hasGoals && (
          <button 
            className="wizard-dashboard-btn"
            onClick={() => navigate('/dashboard')}
            title="Go to dashboard"
          >
            <span className="wizard-dashboard-icon">📊</span>
            <span className="wizard-dashboard-text">Dashboard</span>
          </button>
        )}
      </header>

      {/* Expanded progress panel */}
      <AnimatePresence>
        {showProgress && (
          <motion.div 
            className="wizard-progress-panel"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="progress-panel-content">
              {sections.map(section => {
                const sectionSteps = steps.filter(s => s.section === section.id);
                if (sectionSteps.length === 0) return null;

                return (
                  <div key={section.id} className="progress-section">
                    <div 
                      className="progress-section-header"
                      style={{ borderLeftColor: section.color }}
                    >
                      {section.label}
                    </div>
                    <div className="progress-section-steps">
                      {sectionSteps.map(step => {
                        const stepIndex = steps.findIndex(s => s.key === step.key);
                        const completed = isStepCompleted(stepIndex);
                        const accessible = isStepAccessible(stepIndex);
                        const isCurrent = stepIndex === currentStep;

                        return (
                          <button
                            key={step.key}
                            className={`progress-step-btn ${completed ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${!accessible ? 'locked' : ''}`}
                            onClick={() => accessible && handleStepClick(stepIndex)}
                            disabled={!accessible}
                            style={{ 
                              borderColor: isCurrent ? section.color : undefined,
                              backgroundColor: isCurrent ? `${section.color}15` : undefined
                            }}
                          >
                            <span className="progress-step-emoji">
                              {completed ? '✓' : step.emoji}
                            </span>
                            <span className="progress-step-label">{step.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <button 
              className="progress-panel-close"
              onClick={() => setShowProgress(false)}
            >
              Close ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close progress panel */}
      {showProgress && (
        <div 
          className="progress-panel-overlay"
          onClick={() => setShowProgress(false)}
        />
      )}

      {/* Progress bar */}
      <div className="wizard-progress-bar-container">
        <div 
          className="wizard-progress-bar" 
          style={{ 
            width: `${((currentStep + 1) / steps.length) * 100}%`,
            backgroundColor: currentSection?.color
          }}
        />
      </div>

      {/* Transition Message */}
      {showTransition && currentStepData.transition && (
        <TransitionMessage
          emoji={currentStepData.transition.emoji}
          message={currentStepData.transition.message}
          subMessage={currentStepData.transition.subMessage}
          onComplete={handleTransitionComplete}
        />
      )}

      {/* Main Step Content */}
      {!showTransition && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="wizard-step"
          >
            <CurrentStepComponent />
          </motion.div>
        </AnimatePresence>
      )}

      {/* Background shapes */}
      <div className="wizard-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
    </div>
  );
};

const Wizard = () => {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  );
};

export default Wizard;