import React, { useState, useEffect } from 'react';
import { useWizard } from '../../context/WizardContext';
import { getSuggestions, getNewSuggestions, getQuestionMeta } from '../../data/suggestions';
import './WizardSteps.css';

const QUESTION_KEY = 'perfectDay';

const PerfectDayStep = () => {
  const { answers, updateAnswer, nextStep } = useWizard();
  const [selectedItems, setSelectedItems] = useState(answers.perfectDay || []);
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
    if (selectedItems.includes(suggestion)) {
      setSelectedItems(selectedItems.filter(i => i !== suggestion));
    } else {
      setSelectedItems([...selectedItems, suggestion]);
    }
  };

  const handleAddCustom = () => {
    if (inputValue.trim() && !selectedItems.includes(inputValue.trim())) {
      setSelectedItems([...selectedItems, `${meta.customPrefix} ${inputValue.trim()}`]);
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
    updateAnswer('perfectDay', selectedItems);
    nextStep();
  };

  return (
    <div className="step-container">
      <div className="step-emoji-wrapper">
        <span className="step-emoji sun">☀️</span>
        {selectedItems.length > 0 && (
          <span className="step-emoji-badge">{selectedItems.length}</span>
        )}
      </div>
      
      <div className={`step-question-badge sunshine ${hasAnimated ? 'settled' : ''}`}>
        <span className="badge-text">My perfect Tuesday in 2026 includes...</span>
      </div>

      {selectedItems.length > 0 && (
        <div className="step-selected">
          {selectedItems.map((item, index) => (
            <span 
              key={index} 
              className="step-selected-item"
              onClick={() => handleChipClick(item)}
            >
              {item} <span className="remove-x">×</span>
            </span>
          ))}
        </div>
      )}

      <div className="step-input-row">
        <input
          type="text"
          className="step-input-main"
          placeholder={selectedItems.length > 0 ? "Add another thing..." : "Type something..."}
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
              className={`step-chip ${selectedItems.includes(suggestion) ? 'selected' : ''}`}
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
        {selectedItems.length > 0 
          ? `Continue with ${selectedItems.length} ${selectedItems.length === 1 ? 'thing' : 'things'} →` 
          : 'Skip for now →'}
      </button>

      <div className="step-insight">
        <span className="step-insight-icon">💡</span>
        <span className="step-insight-text">
          Extraordinary lives are built from ordinary days. Design the day, design the year.
        </span>
      </div>
    </div>
  );
};

export default PerfectDayStep;