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
  // Welcome
  { 
    component: WelcomeStep, 
    key: 'welcome',
    transition: null 
  },
  // Looking back at 2025
  { 
    component: TravelMemoryStep, 
    key: 'travel-memory',
    transition: {
      emoji: '✨',
      message: "Before we plan your 2026...",
      subMessage: "Let's look back and reflect on the year that was"
    }
  },
  { 
    component: BigMomentStep, 
    key: 'big-moment',
    transition: {
      emoji: '🎯',
      message: "Now the big stuff",
      subMessage: "Those moments that changed everything"
    }
  },
  { 
    component: QuietJoyStep, 
    key: 'quiet-joy',
    transition: {
      emoji: '🌸',
      message: "What about the quiet moments?",
      subMessage: "Sometimes the small things mean the most"
    }
  },
  { 
    component: HabitsStuckStep, 
    key: 'habits-stuck',
    transition: {
      emoji: '💪',
      message: "Let's talk habits",
      subMessage: "The things you actually stuck with this year"
    }
  },
  { 
    component: PersonMadeYearStep, 
    key: 'person-made-year',
    transition: {
      emoji: '❤️',
      message: "The people in your life",
      subMessage: "Who made 2025 brighter?"
    }
  },
  { 
    component: CelebrationStep, 
    key: 'celebration',
    transition: null
  },
  // Honest reflection
  { 
    component: WhatDidntWorkStep, 
    key: 'what-didnt-work',
    transition: {
      emoji: '🪞',
      message: "Time for some honesty",
      subMessage: "No judgment — just clarity"
    }
  },
  { 
    component: WishedMoreTimeStep, 
    key: 'wished-more-time',
    transition: {
      emoji: '⏰',
      message: "If only there were more hours...",
      subMessage: "What deserved more of your time?"
    }
  },
  // Vision for 2026
  { 
    component: VisionTransitionStep, 
    key: 'vision-transition',
    transition: null
  },
  { 
    component: KindOfPersonStep, 
    key: 'kind-of-person',
    transition: {
      emoji: '🦋',
      message: "Now let's dream",
      subMessage: "Who do you want to become?"
    }
  },
  { 
    component: PerfectDayStep, 
    key: 'perfect-day',
    transition: {
      emoji: '☀️',
      message: "Picture this...",
      subMessage: "Your perfect ordinary day in 2026"
    }
  },
  { 
    component: WantToExperienceStep, 
    key: 'want-to-experience',
    transition: {
      emoji: '🌈',
      message: "What's calling you?",
      subMessage: "The experiences you're craving"
    }
  },
  // Goals for 2026
  { 
    component: GoalsTransitionStep, 
    key: 'goals-transition',
    transition: null
  },
  { 
    component: GoalsDreamsStep, 
    key: 'goals-dreams',
    transition: {
      emoji: '🚀',
      message: "Let's make it real",
      subMessage: "Time to set some goals"
    }
  },
  { 
    component: PlaceToVisitStep, 
    key: 'place-to-visit',
    transition: {
      emoji: '🗺️',
      message: "Adventure awaits",
      subMessage: "Where will 2026 take you?"
    }
  },
  { 
    component: HabitToBuildStep, 
    key: 'habit-to-build',
    transition: {
      emoji: '🔄',
      message: "Small steps, big changes",
      subMessage: "What habit will transform your year?"
    }
  },
  { 
    component: SavingForStep, 
    key: 'saving-for',
    transition: {
      emoji: '💰',
      message: "Worth saving for",
      subMessage: "What gets you excited to save?"
    }
  },
  { 
    component: FinalCelebrationStep, 
    key: 'final-celebration',
    transition: {
      emoji: '🎉',
      message: "You did it!",
      subMessage: "2026 is officially planned"
    }
  }
];

const WizardContent = () => {
  const { currentStep } = useWizard();
  const navigate = useNavigate();
  const [showTransition, setShowTransition] = useState(false);
  const [lastStep, setLastStep] = useState(-1);

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

  return (
    <div className="wizard">
      <div className="wizard-progress">
        <div 
          className="wizard-progress-bar" 
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
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