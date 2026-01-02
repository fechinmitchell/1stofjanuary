import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getGoals, saveGoals, deleteGoals } from '../services/api';

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
        setIsLoaded(false);
        
        // First check localStorage for immediate display
        const savedAnswers = localStorage.getItem(`wizard_answers_${user.uid}`);
        if (savedAnswers) {
          try {
            const parsed = JSON.parse(savedAnswers);
            setAnswers(parsed);
            console.log('✅ Goals loaded from localStorage');
          } catch (e) {
            console.log('Could not parse localStorage');
          }
        }
        
        // Then try to sync with cloud
        try {
          const response = await getGoals(currentYear);
          if (response.goals && Object.keys(response.goals).length > 0) {
            setAnswers(response.goals);
            // Update localStorage with cloud data
            localStorage.setItem(`wizard_answers_${user.uid}`, JSON.stringify(response.goals));
            console.log('✅ Goals synced from cloud');
          } else if (savedAnswers) {
            // If cloud is empty but localStorage has data, sync to cloud
            const parsed = JSON.parse(savedAnswers);
            if (Object.keys(parsed).length > 0) {
              await saveGoals(currentYear, parsed);
              console.log('✅ Goals migrated to cloud');
            }
          }
        } catch (error) {
          console.log('⚠️ Cloud sync failed, using localStorage:', error.message);
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
        
        // Always save to localStorage immediately
        localStorage.setItem(`wizard_answers_${user.uid}`, JSON.stringify(answers));
        
        try {
          await saveGoals(currentYear, answers);
          console.log('✅ Goals saved to cloud');
        } catch (error) {
          console.log('⚠️ Could not save to cloud:', error.message);
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
      // Clear localStorage
      localStorage.removeItem(`wizard_answers_${user.uid}`);
      
      // Delete from cloud
      try {
        await deleteGoals(currentYear);
        console.log('✅ Goals deleted from cloud');
      } catch (error) {
        console.log('⚠️ Could not delete cloud data:', error.message);
      }
    }
  }, [user]);

  // Check if user has any goals with actual content
  const hasGoals = Object.keys(answers).some(key => {
    const value = answers[key];
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  });

  // Count total goals
  const totalGoals = Object.values(answers).reduce((total, value) => {
    if (Array.isArray(value)) {
      return total + value.length;
    } else if (value) {
      return total + 1;
    }
    return total;
  }, 0);

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
      isSaving,
      hasGoals,
      totalGoals
    }}>
      {children}
    </WizardContext.Provider>
  );
};