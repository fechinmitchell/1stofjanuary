import React, { useState, useEffect } from 'react';
import { useWizard } from '../../context/WizardContext';
import { getSuggestions, getNewSuggestions, getQuestionMeta } from '../../data/suggestions';
import './WizardSteps.css';

const QUESTION_KEY = 'travelMemory';

const TravelMemoryStep = () => {
  const { answers, updateAnswer, nextStep } = useWizard();
  const [selectedPlaces, setSelectedPlaces] = useState(answers.travelMemory || []);
  const [inputValue, setInputValue] = useState('');
  const [hasAnimated, setHasAnimated] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState([]);

  const meta = getQuestionMeta(QUESTION_KEY);

  useEffect(() => {
    setCurrentSuggestions(getSuggestions(QUESTION_KEY, 12));
    const timer = setTimeout(() => setHasAnimated(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleChipClick = (suggestion) => {
    if (selectedPlaces.includes(suggestion)) {
      setSelectedPlaces(selectedPlaces.filter(p => p !== suggestion));
    } else {
      setSelectedPlaces([...selectedPlaces, suggestion]);
    }
  };

  const handleAddCustom = () => {
    if (inputValue.trim() && !selectedPlaces.includes(inputValue.trim())) {
      setSelectedPlaces([...selectedPlaces, `${meta.customPrefix} ${inputValue.trim()}`]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddCustom();
    }
  };

  const handleRefreshSuggestions = () => {
    setCurrentSuggestions(getNewSuggestions(QUESTION_KEY, currentSuggestions, 12));
  };

  const handleContinue = () => {
    updateAnswer('travelMemory', selectedPlaces);
    nextStep();
  };

  return (
    <div className="step-container">
      <div className="step-emoji-wrapper">
        <span className="step-emoji travel">✈️</span>
        {selectedPlaces.length > 0 && (
          <span className="step-emoji-badge">{selectedPlaces.length}</span>
        )}
      </div>
      
      <div className={`step-question-badge mint ${hasAnimated ? 'settled' : ''}`}>
        <span className="badge-text">I really loved when I travelled to...</span>
      </div>

      {selectedPlaces.length > 0 && (
        <div className="step-selected">
          {selectedPlaces.map((place, index) => (
            <span 
              key={index} 
              className="step-selected-item"
              onClick={() => handleChipClick(place)}
            >
              {place} <span className="remove-x">×</span>
            </span>
          ))}
        </div>
      )}

      <div className="step-input-row">
        <input
          type="text"
          className="step-input-main"
          placeholder={selectedPlaces.length > 0 ? "Add another place..." : "Type a place..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        {inputValue && (
          <button className="step-add-btn" onClick={handleAddCustom}>
            Add +
          </button>
        )}
      </div>

      <p className="step-hint">{meta.hint}</p>

      <div className="step-suggestions">
        <span className="step-suggestions-label">{meta.suggestionsLabel}</span>
        <div className="step-chips">
          {currentSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              className={`step-chip ${selectedPlaces.includes(suggestion) ? 'selected' : ''}`}
              onClick={() => handleChipClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
        <button className="step-refresh-btn" onClick={handleRefreshSuggestions}>
          ✨ Show me more ideas
        </button>
      </div>

      <button 
        className="step-button" 
        onClick={handleContinue}
      >
        {selectedPlaces.length > 0 
          ? `Continue with ${selectedPlaces.length} ${selectedPlaces.length === 1 ? 'memory' : 'memories'} →` 
          : 'Skip for now →'}
      </button>

      <div className="step-insight">
        <span className="step-insight-icon">💡</span>
        <span className="step-insight-text">
          People who book trips in advance report higher happiness levels — even before they go.
        </span>
      </div>
    </div>
  );
};

export default TravelMemoryStep;