import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getGoals, saveGoals } from '../services/api';

const WizardContext = createContext();

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};

export const WizardProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const currentYear = 2026;

  // Load answers when user logs in
  useEffect(() => {
    const loadAnswers = async () => {
      if (user) {
        try {
          // Try to load from backend first
          const response = await getGoals(currentYear);
          if (response.goals && Object.keys(response.goals).length > 0) {
            setAnswers(response.goals);
            console.log('✅ Goals loaded from cloud');
          } else {
            // Fall back to localStorage
            const savedAnswers = localStorage.getItem(`wizard_answers_${user.uid}`);
            if (savedAnswers) {
              const parsed = JSON.parse(savedAnswers);
              setAnswers(parsed);
              // Sync localStorage data to backend
              await saveGoals(currentYear, parsed);
              console.log('✅ Goals migrated from localStorage to cloud');
            }
          }
        } catch (error) {
          console.log('⚠️ Could not load from cloud, using localStorage');
          // Fall back to localStorage if backend fails
          const savedAnswers = localStorage.getItem(`wizard_answers_${user.uid}`);
          if (savedAnswers) {
            setAnswers(JSON.parse(savedAnswers));
          }
        }
        setIsLoaded(true);
      } else {
        setAnswers({});
        setIsLoaded(true);
      }
    };

    loadAnswers();
  }, [user]);

  // Save answers when they change
  useEffect(() => {
    const saveAnswersToCloud = async () => {
      if (user && isLoaded && Object.keys(answers).length > 0) {
        setIsSaving(true);
        try {
          // Save to backend
          await saveGoals(currentYear, answers);
          // Also keep localStorage as backup
          localStorage.setItem(`wizard_answers_${user.uid}`, JSON.stringify(answers));
          console.log('✅ Goals saved to cloud');
        } catch (error) {
          console.log('⚠️ Could not save to cloud, saved to localStorage');
          // Save to localStorage as fallback
          localStorage.setItem(`wizard_answers_${user.uid}`, JSON.stringify(answers));
        }
        setIsSaving(false);
      }
    };

    // Debounce saves
    const timeoutId = setTimeout(saveAnswersToCloud, 1000);
    return () => clearTimeout(timeoutId);
  }, [answers, user, isLoaded]);

  const updateAnswer = useCallback((questionKey, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionKey]: answer
    }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => prev + 1);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);

  const goToStep = useCallback((step) => {
    setCurrentStep(step);
  }, []);

  const resetWizard = useCallback(async () => {
    setAnswers({});
    setCurrentStep(0);
    if (user) {
      localStorage.removeItem(`wizard_answers_${user.uid}`);
      try {
        await saveGoals(currentYear, {});
      } catch (error) {
        console.log('Could not reset cloud data');
      }
    }
  }, [user]);

  return (
    <WizardContext.Provider value={{
      currentStep,
      answers,
      updateAnswer,
      nextStep,
      prevStep,
      goToStep,
      resetWizard,
      isLoaded,
      isSaving
    }}>
      {children}
    </WizardContext.Provider>
  );
};